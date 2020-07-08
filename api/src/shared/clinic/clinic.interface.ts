import { IProfile } from '../profile/profile.interface';

export enum CLINIC_PROPS {
  BADGE = 'badge',
  DESCRIPTION = 'description',
  ENROLLED_USERS = 'enrolledUsers',
  ID = 'id',
  INSTRUCTOR = 'instructor',
  TITLE = 'title',
}

export interface IClinic {
  [CLINIC_PROPS.BADGE]?: string[];
  [CLINIC_PROPS.DESCRIPTION]?: string;
  [CLINIC_PROPS.ENROLLED_USERS]?: string[];
  [CLINIC_PROPS.ID]?: string;
  [CLINIC_PROPS.INSTRUCTOR]?: string;
  [CLINIC_PROPS.TITLE]?: string;
}

export interface IClinicResolved {
  [CLINIC_PROPS.BADGE]?: string[];
  [CLINIC_PROPS.DESCRIPTION]?: string;
  [CLINIC_PROPS.ENROLLED_USERS]?: IProfile[];
  [CLINIC_PROPS.ID]?: string;
  [CLINIC_PROPS.INSTRUCTOR]?: IProfile;
  [CLINIC_PROPS.TITLE]?: string;
}
