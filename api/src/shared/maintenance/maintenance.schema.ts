import * as mongoose from 'mongoose';
import { MAINTENANCE_PROPS } from './maintenance.interface';
import { MAINTENANCE_STATUS } from './maintenance-status.enum';
import { CommentSchema } from '../comment/comment.schema';
import { MediaSchema } from '../media/media.schema';
import { DB_MODELS } from '../db-models.enum';

export const MaintenanceVirtuals = [
  {
    name: MAINTENANCE_PROPS.REQUESTED_BY_RESOLVED,
    model: {
      ref: DB_MODELS.PROFILE,
      localField: MAINTENANCE_PROPS.REQUESTED_BY,
      foreignField: '_id',
      justOne: true,
    },
  },
  {
    name: MAINTENANCE_PROPS.SERVICED_BY_RESOLVED,
    model: {
      ref: DB_MODELS.PROFILE,
      localField: MAINTENANCE_PROPS.SERVICED_BY,
      foreignField: '_id',
      justOne: true,
    },
  },
  {
    name: MAINTENANCE_PROPS.BOAT_RESOLVED,
    model: {
      ref: DB_MODELS.BOAT,
      localField: MAINTENANCE_PROPS.BOAT,
      foreignField: '_id',
      justOne: true,
    },
  },
];

export const SBoatMaintenance = {
  [MAINTENANCE_PROPS.BOAT]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.BOAT },
  [MAINTENANCE_PROPS.COMMENTS]: [CommentSchema],
  [MAINTENANCE_PROPS.PICTURES]: [MediaSchema],
  [MAINTENANCE_PROPS.REQUESTED_BY]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  [MAINTENANCE_PROPS.REQUEST]: String,
  [MAINTENANCE_PROPS.REQUEST_DATE]: Date,
  [MAINTENANCE_PROPS.SERVICED_BY]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  [MAINTENANCE_PROPS.SERVICED_ON]: Date,
  [MAINTENANCE_PROPS.SERVICE_DETAILS]: String,
  [MAINTENANCE_PROPS.STATUS]: {
    type: String,
    enum: Object.values(MAINTENANCE_STATUS),
    default: MAINTENANCE_STATUS.NEW,
  },
};

export const SIBoatMaintenance = [
  {
    fields: {
      [MAINTENANCE_PROPS.STATUS]: 1,
      [MAINTENANCE_PROPS.REQUEST_DATE]: -1,
    },
    options: {
      unique: false,
    },
  },
];
