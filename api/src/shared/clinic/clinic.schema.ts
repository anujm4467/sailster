import * as mongoose from 'mongoose';
import { DB_MODELS } from '../db-models.enum';
import { CLINIC_PROPS } from './clinic.interface';

export const ClinicSchema = {
  [CLINIC_PROPS.BADGE]: [String],
  [CLINIC_PROPS.DESCRIPTION]: String,
  [CLINIC_PROPS.INSTRUCTOR]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  [CLINIC_PROPS.ENROLLED_USERS]: [{ type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE }],
  [CLINIC_PROPS.TITLE]: String,

};

export const ClinicSchemaIndex = [];
