import { Connection } from 'mongoose';
import { sailPicturesSchema } from './sail-pictures.schema';

export const sailPicturesProviders = [
  {
    provide: 'SAIL_PICTURES_MODEL',
    useFactory: (connection: Connection) => connection.model('SailPictures', sailPicturesSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
