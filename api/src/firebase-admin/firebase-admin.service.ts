import * as admin from 'firebase-admin';
import * as moment from 'moment';
import * as UUID from 'uuid-v4';
import {
  Bucket,
  File,
  GetFilesOptions,
  GetFilesResponse,
} from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseAdminService {
  private readonly firebaseAdmin;

  constructor() {

    const serviceAccount = process.env.FIREBASE_ADMIN_SDK_JSON ?
      JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON) :
      require(process.env.FIREBASE_ADMIN_SDK_ACCOUNT_FILE);

    this.firebaseAdmin = admin
      .initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

  }

  public listFiles(query?: GetFilesOptions): Promise<string[]> {
    const storage: admin.storage.Storage = this.firebaseAdmin.storage();
    const bucket: Bucket = storage.bucket();

    return bucket
      .getFiles(query)
      .then((response: GetFilesResponse) => response[0])
      .then((files: File[]) => files.map(file => file.name));
  }

  public getFileUrl(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage: admin.storage.Storage = this.firebaseAdmin.storage();
      const bucket: Bucket = storage.bucket();
      const file: File = bucket.file(filePath);

      file
        .exists()
        .then(exists => exists[0])
        .then((exists) => {
          if (!exists) {
            reject(new Error('404'));
          }

          file
            .getSignedUrl({ action: 'read', expires: moment().add(1, 'days').toDate() })
            .then(urls => resolve(urls[0]))
            .catch(error => reject(error.message));

        });

    });
  }

  public uploadFile(destination: string, contentType: string, stream: any): Promise<string> {
    const storage: admin.storage.Storage = this.firebaseAdmin.storage();
    const bucket: Bucket = storage.bucket();
    const file: File = bucket.file(destination);

    const uuid = UUID();

    return file
      .save(stream, {
        public: true,
        resumable: false,
        gzip: true,
        predefinedAcl: 'publicRead',
        metadata: {
          contentType,
          cacheControl: 'public, max-age=31536000',
          firebaseStorageDownloadTokens: uuid,
        },
      })
      .then(() => destination);
  }

  public deleteFile(destination: string): Promise<string> {
    const storage: admin.storage.Storage = this.firebaseAdmin.storage();
    const bucket: Bucket = storage.bucket();
    const file: File = bucket.file(destination);

    return file
      .delete()
      .then(() => 'deleted');
  }
}
