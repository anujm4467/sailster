import * as mongoose from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { IMedia } from '../shared/media/media.interface';
import { ISailPictures } from '../shared/sail-pictures/sail-pictures.interface';
import { JwtObject } from '../shared/token/jwt-object.interface';
import { SailPicturesService } from './sail-pictures.service';

@Controller('sail-pictures')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class SailPicturesController extends CrudController<ISailPictures> {

  constructor(
    service: SailPicturesService,
  ) {
    super(service);
    this.allowedRoutes = null;
  }

  @Get(':sailId')
  getPictures(@Param('sailId') sailId: string) {
    return this.service.findOne<ISailPictures>({ sail: sailId });
  }

  @Patch(':sailId')
  addNewPictures(@Request() request, @Param('sailId') sailId: string, @Body() pictures: IMedia[]) {
    const user: JwtObject = request.user;

    if (!user) {
      return Promise.reject(new Error('Not authrorized'));
    }

    pictures.forEach((picture) => {
      picture.id = new mongoose.Types.ObjectId().toHexString();
      picture._id =  picture.id;
      picture.author = user.profileId;
    });

    return this.service
      .findOne<ISailPictures>({ sail: sailId })
      .then((sailPictures) => {
        if (!sailPictures) {
          return this.service.create({ pictures, sail: sailId });
        }
        return this.service.updateByIdAnything(sailPictures.id, { $push: { pictures: { $each: pictures } } });
      });
  }

  @Delete(':sailId/:pictureId')
  deletePicture(@Param('sailId') sailId: string, @Param('pictureId') pictureId: string) {
    return this.service
      .findOne<ISailPictures>({ sail: sailId })
      .then((sailPictures) => {
        if (!sailPictures) {
          return;
        }
        return this.service.updateByIdAnything(sailPictures.id, { $pull: { pictures: { _id: pictureId } } });
      });
  }
}
