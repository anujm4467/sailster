import {
  Request,
  Response,
} from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as os from 'os';
import * as sharp from 'sharp';
import { GetFilesOptions } from '@google-cloud/storage';
import {
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { FirebaseAdminService } from './firebase-admin.service';

@Controller('fba')
export class FirebaseAdminController {

  private readonly logger: Logger;
  protected readonly logError = error => this.logger.error(error.message, error.stack);
  protected readonly logInfo = message => this.logger.log(message);

  constructor(
    @Inject(FirebaseAdminService) private service: FirebaseAdminService,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  private resizeImage(image: string, options: any, destination: string): Promise<any> {
    const background = { r: 255, g: 255, b: 255, alpha: 1 };

    return sharp(image)
      .resize({
        ...options,
        background: options.background || background,
        fastShrinkOnLoad: options.fastShrinkOnLoad || false,
        fit: options.fit || 'outside',
        height: +options.height,
        kernel: options.kernel || 'lanczos3',
        width: +options.width,
      })
      .toFile(destination);
  }

  private deleteLocalFile(pathToFile: string): void {
    fs.unlink(pathToFile, (error) => {
      if (error) {
        this.logError(new Error(`error deleting file: ${pathToFile}; ${error.message}`));
      } else {
        this.logInfo(`deleted file: ${pathToFile}`);
      }
    });
  }

  @Get('/list')
  listFiles(@Query() query: GetFilesOptions): Promise<string[]> {
    return this.service.listFiles(query);
  }

  @Get('/files/images/*')
  getImageUrl(@Req() request: Request, @Query() query, @Res() response: Response) {
    return this.getSubImageUrl(request, query, response);
  }

  @Get('/files/*/images/*')
  getSubImageUrl(@Req() request: Request, @Query() query, @Res() response: Response) {
    const originalBucketPath = request.path.replace('/fba/files/', '');

    delete query.salt;

    const queryString = Object.values(query).join('.');

    if (originalBucketPath.toLowerCase().endsWith('.gif') || !queryString) {
      return this.getFileUrl(request, response);
    }

    const fileName = originalBucketPath.substring(originalBucketPath.lastIndexOf('/') + 1);

    let scaledPath = originalBucketPath;
    let scaledFileName = fileName;

    const lastDot = originalBucketPath.lastIndexOf('.');
    scaledFileName = `${fileName.substring(0, fileName.lastIndexOf('.'))}.${queryString}${fileName.substring(fileName.lastIndexOf('.'))}`;
    scaledPath = `${originalBucketPath.substring(0, lastDot)}.${queryString}${originalBucketPath.substring(lastDot)}`;

    this.service
      .getFileUrl(scaledPath)
      .then(foundUrl => response.redirect(foundUrl))
      .catch((error) => {
        if (error.message !== '404') {
          response.status(500).send('failed to get cdn file');
          return;
        }

        return this.service
          .getFileUrl(originalBucketPath)
          .then((foundOriginalUrl) => {
            const DOWNLOAD_DIR = os.tmpdir();
            const tmpFilePath = `${DOWNLOAD_DIR}/${fileName}`;
            const tmpScaledPath = `${DOWNLOAD_DIR}/${scaledFileName}`;
            const originalFile = fs.createWriteStream(tmpFilePath);

            https
              .get(foundOriginalUrl, (resp) => {
                resp
                  .on('data', (chunk) => {
                    originalFile.write(chunk);
                  });
                resp.on('end', () => {
                  originalFile.end();
                  this.resizeImage(tmpFilePath, query, tmpScaledPath)
                    .then((info) => {
                      this.logInfo(info);
                      this.deleteLocalFile(tmpFilePath);

                      const stream = fs.readFileSync(tmpScaledPath);
                      this.service
                        .uploadFile(scaledPath, `image/${info.format}`, stream)
                        .then((uploadedUrl) => {
                          this.deleteLocalFile(tmpScaledPath);
                          this.logInfo(`uploadedUrl = ${uploadedUrl}`);
                          this.service
                            .getFileUrl(uploadedUrl)
                            .then(downloadUrl => response.redirect(downloadUrl))
                            .catch((scaledUrlError) => {
                              this.logError(scaledUrlError);
                              response.status(500).send('failed to get url of scaled image');
                            });
                        })
                        .catch((uploadError) => {
                          this.logError(uploadError);
                          response.status(500).send('failed to upload scaled image');
                        });
                    })
                    .catch((resizeError) => {
                      this.logError(resizeError);
                      response.status(500).send('failed to resize image');
                    });
                });
              })
              .on('error', (downloadError) => {
                this.logError(downloadError);
                response.status(500).send('failed to download original image');
              });
          })
          .catch((originalUrlError) => {
            this.logError(originalUrlError);
            return response.status(404).send('failed to find original image url');
          });
      });

  }

  @Get('/files/*')
  getFileUrl(@Req() request: Request, @Res() response: Response) {
    const bucketPath = request.path.replace('/fba/files/', '');

    this.service
      .getFileUrl(bucketPath)
      .then(url => response.redirect(url))
      .catch(() => response.status(404).send('not found'));
  }

  @Delete('/files/*')
  @UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
  deleteFile(@Req() request: Request): Promise<string> {
    const bucketPath = request.path.replace('/fba/files/', '');

    return this.service
      .deleteFile(bucketPath)
      .catch((error) => {
        if (error.code === 404) {
          return 'deleted';
        }

        throw error;
      });
  }

  @Post('/upload/*')
  @UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Req() request, @UploadedFile() file) {
    const path = request.path.replace('/fba/upload/', '');

    return this.service.uploadFile(path, file.mimetype, file.buffer);
  }
}
