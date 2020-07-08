import * as mongoose from 'mongoose';
import { DB_MODELS } from '../db-models.enum';
import { MediaSchema } from '../media/media.schema';
import { SAIL_PICTURES_PROPS } from './sail-pictures.interface';

export const SailPicturesSchema = {
  [SAIL_PICTURES_PROPS.PICTURES]: [MediaSchema],
  [SAIL_PICTURES_PROPS.SAIL]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.SAIL },
};

export const SailPicturesSchemaIndex = [
  {
    fields: {
      [SAIL_PICTURES_PROPS.SAIL]: -1,
    },
    options: {
      unique: true,
    },
  },
];
