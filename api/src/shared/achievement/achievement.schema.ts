import * as mongoose from 'mongoose';
import { DB_MODELS } from '../db-models.enum';
import { ACHIEVEMENT_PROPS } from './achievement.interface';

export const AchievementSchema = {
  [ACHIEVEMENT_PROPS.ACHIEVED_BY]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  [ACHIEVEMENT_PROPS.BADGE]: { type: String, required: false },
  [ACHIEVEMENT_PROPS.CLINIC]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.CLINIC },
  [ACHIEVEMENT_PROPS.GIVEN_BY]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE, required: true },
  [ACHIEVEMENT_PROPS.GIVEN_ON]: { type: Date, required: true },
  [ACHIEVEMENT_PROPS.TITLE]: { type: String, required: true },
};
