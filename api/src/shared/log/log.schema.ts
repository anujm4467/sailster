import * as mongoose from 'mongoose';
import { DB_MODELS } from '../db-models.enum';
import {
  LOG_PROPS,
  LOG_TYPE,
} from './log.interface';

export const LogSchema = {
  [LOG_PROPS.DATA]: Object,
  [LOG_PROPS.MESSAGE]: String,
  [LOG_PROPS.TYPE]: { type: String, enum: Object.values(LOG_TYPE), default: LOG_TYPE.INFO },
  [LOG_PROPS.USER]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
};

export const LogSchemaOptions = {
  strict: false,
};

export const LogSchemaIndex = [
  {
    fields: {
      [LOG_PROPS.USER]: -1,
    },
    options: {
      unique: false,
    },
  },
  {
    fields: {
      [LOG_PROPS.TYPE]: -1,
    },
    options: {
      unique: false,
    },
  },
];
