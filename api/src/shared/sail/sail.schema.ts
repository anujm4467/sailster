import * as mongoose from 'mongoose';
import { CommentSchema } from '../comment/comment.schema';
import { DB_MODELS } from '../db-models.enum';
import { SAIL_STATUS } from './sail-status';
import { SAIL_PROPS } from './sail.interface';

export const SailVirtuals = [
  {
    name: 'history',
    model: {
      ref: DB_MODELS.HISTORY,
      localField: '_id',
      foreignField: 'forId',
      justOne: false,
    },
  },
];

export const SailSchema = {
  [SAIL_PROPS.BOAT]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.BOAT },
  [SAIL_PROPS.CANCELLED_BY]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  [SAIL_PROPS.CANCELLED_ON]: Date,
  [SAIL_PROPS.CANCEL_REASON]: String,
  [SAIL_PROPS.CHECKLIST]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.SAIL_CHECKLIST },
  [SAIL_PROPS.COMMENTS]: [CommentSchema],
  [SAIL_PROPS.CREW]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  [SAIL_PROPS.DESCRIPTION]: String,
  [SAIL_PROPS.END]: { type: Date, required: true },
  [SAIL_PROPS.MAX_OCCUPANCY]: Number,
  [SAIL_PROPS.NAME]: { type: String, required: true },
  [SAIL_PROPS.PASSENGERS]: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE }], default: [] },
  [SAIL_PROPS.SKIPPER]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  [SAIL_PROPS.START]: { type: Date, required: true },
  [SAIL_PROPS.STATUS]: { type: String, enum: Object.values(SAIL_STATUS), default: SAIL_STATUS.NEW },
};

export const SailSchemaIndex = [
  {
    fields: {
      [SAIL_PROPS.BOAT]: -1,
      [SAIL_PROPS.START]: -1,
      [SAIL_PROPS.END]: -1,
    },
    options: {
      unique: true,
    },
  },
  {
    fields: {
      [SAIL_PROPS.SKIPPER]: -1,
    },
  },
  {
    fields: {
      [SAIL_PROPS.CREW]: -1,
    },
  },
  {
    fields: {
      [SAIL_PROPS.PASSENGERS]: -1,
    },
  },
];
