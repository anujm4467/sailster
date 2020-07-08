import * as mongoose from 'mongoose';
import { DB_MODELS } from '../db-models.enum';
import { SAIL_REQUEST_STATUS } from './sail-request-status';
import { SAIL_REQUEST_PROPS } from './sail-request.interface';

export const SailRequestVirtuals = [
];

export const SailRequestSchema = {
  [SAIL_REQUEST_PROPS.BY]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE, required: true },
  [SAIL_REQUEST_PROPS.DESCRIPTION]: String,
  [SAIL_REQUEST_PROPS.END]: { type: Date, required: true },
  [SAIL_REQUEST_PROPS.START]: { type: Date, required: true },
  [SAIL_REQUEST_PROPS.STATUS]: {
    type: String,
    enum: Object.values(SAIL_REQUEST_STATUS),
    default: SAIL_REQUEST_STATUS.NEW,
  },
};

export const SailRequestSchemaIndex = [
  {
    fields: {
      [SAIL_REQUEST_PROPS.BY]: -1,
    },
  },
  {
    fields: {
      [SAIL_REQUEST_PROPS.STATUS]: -1,
    },
  },
  {
    fields: {
      [SAIL_REQUEST_PROPS.START]: -1,
    },
  },
];
