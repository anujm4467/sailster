import { AchievementSchema } from '../achievement/achievement.schema';
import { PROFILE_STATUS } from './profile-status.enum';
import { PROFILE_PROPS } from './profile.interface';

export const ProfileSchema = {
  [PROFILE_PROPS.ACHIEVEMENTS]: {
    type: [AchievementSchema],
    default: [],
  },
  [PROFILE_PROPS.BIO]: String,
  [PROFILE_PROPS.EMAIL]: { type: String, required: true },
  [PROFILE_PROPS.NAME]: { type: String, required: true },
  [PROFILE_PROPS.PHONE]: String,
  [PROFILE_PROPS.PICTURE]: String,
  [PROFILE_PROPS.STATUS]: {
    type: String,
    enum: Object.values(PROFILE_STATUS),
    default: PROFILE_STATUS.REGISTRATION,
  },
  [PROFILE_PROPS.ROLES]: {
    type: [String],
    default: [],
  },
};

export const ProfileSchemaIndex = [
  {
    fields: {
      [PROFILE_PROPS.EMAIL]: 1,
    },
    options: {
      unique: true,
    },
  },
  {
    fields: {
      [PROFILE_PROPS.EMAIL]: 'text',
      [PROFILE_PROPS.NAME]: 'text',
      [PROFILE_PROPS.ROLES]: 'text',
    },
  },
];
