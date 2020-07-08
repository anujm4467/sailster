import { SAIL_REQUEST_STATUS } from './sail-request-status';
import { IProfile } from '../profile/profile.interface';

export enum SAIL_REQUEST_PROPS {
  BY = 'by',
  DESCRIPTION = 'description',
  END = 'end',
  ID = 'id',
  START = 'start',
  STATUS = 'status',
}

export interface ISailRequest {
  [SAIL_REQUEST_PROPS.BY]?: string;
  [SAIL_REQUEST_PROPS.DESCRIPTION]?: string;
  [SAIL_REQUEST_PROPS.END]?: Date;
  [SAIL_REQUEST_PROPS.ID]?: string;
  [SAIL_REQUEST_PROPS.START]?: Date;
  [SAIL_REQUEST_PROPS.STATUS]?: SAIL_REQUEST_STATUS;
}

export interface ISailRequestResolved {
  [SAIL_REQUEST_PROPS.BY]?: IProfile;
  [SAIL_REQUEST_PROPS.DESCRIPTION]?: string;
  [SAIL_REQUEST_PROPS.END]?: Date;
  [SAIL_REQUEST_PROPS.ID]?: string;
  [SAIL_REQUEST_PROPS.START]?: Date;
  [SAIL_REQUEST_PROPS.STATUS]?: SAIL_REQUEST_STATUS;
}
