import { IAchivement } from '../achievement/achievement.interface';
import { PROFILE_ROLES } from './profile-roles.enum';
import { PROFILE_STATUS } from './profile-status.enum';

export enum PROFILE_PROPS {
  ACHIEVEMENTS = 'achievements',
  BIO = 'bio',
  CREATED_AT = 'createdAt',
  EMAIL = 'email',
  ID = 'id',
  NAME = 'name',
  PHONE = 'phone',
  PICTURE = 'picture',
  ROLES = 'roles',
  STATUS = 'status',
  UPDATED_AT = 'updatedAt',
}

export interface IProfile {
  [PROFILE_PROPS.ACHIEVEMENTS]?: IAchivement[];
  [PROFILE_PROPS.BIO]?: string;
  [PROFILE_PROPS.CREATED_AT]?: Date;
  [PROFILE_PROPS.EMAIL]?: string;
  [PROFILE_PROPS.ID]?: string;
  [PROFILE_PROPS.NAME]?: string;
  [PROFILE_PROPS.PHONE]?: string;
  [PROFILE_PROPS.PICTURE]?: string;
  [PROFILE_PROPS.ROLES]?: PROFILE_ROLES[];
  [PROFILE_PROPS.STATUS]?: PROFILE_STATUS;
  [PROFILE_PROPS.UPDATED_AT]?: Date;
}
