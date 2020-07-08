import * as mongoose from 'mongoose';
import { DB_MODELS } from '../db-models.enum';
import { MEDIA_PROPS } from './media.interface';

export interface IMediaSchema {
  [MEDIA_PROPS.AUTHOR]: { type: any; ref: DB_MODELS; };
  [MEDIA_PROPS.COMMENT]: StringConstructor;
  [MEDIA_PROPS.URL]: StringConstructor;
}

export const MediaSchema: IMediaSchema = {
  [MEDIA_PROPS.AUTHOR]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  [MEDIA_PROPS.COMMENT]: String,
  [MEDIA_PROPS.URL]: String,
};
