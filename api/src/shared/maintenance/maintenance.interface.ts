import { IBoat } from '../boat/boat.interface';
import { IComment, ICommentWithResolvedProfile } from '../comment/comment.interface';
import { IMedia } from '../media/media.interface';
import { IProfile } from '../profile/profile.interface';
import { MAINTENANCE_STATUS } from './maintenance-status.enum';

export enum MAINTENANCE_PROPS {
  BOAT = 'boat',
  BOAT_RESOLVED = 'boatResolved',
  COMMENTS = 'comments',
  ID = 'id',
  PICTURES = 'pictures',
  REQUEST = 'request',
  REQUESTED_BY = 'requestedBy',
  REQUESTED_BY_RESOLVED = 'requestedByResolved',
  REQUEST_DATE = 'requestDate',
  SERVICED_BY = 'servicedBy',
  SERVICED_BY_RESOLVED = 'servicedByResolved',
  SERVICED_ON = 'servicedOn',
  SERVICE_DETAILS = 'serviceDetails',
  STATUS = 'status',
}

export interface IBoatMaintenance {
  [MAINTENANCE_PROPS.BOAT]?: string;
  [MAINTENANCE_PROPS.BOAT_RESOLVED]?: IBoat;
  [MAINTENANCE_PROPS.COMMENTS]?: IComment[];
  [MAINTENANCE_PROPS.ID]?: string;
  [MAINTENANCE_PROPS.PICTURES]?: IMedia[];
  [MAINTENANCE_PROPS.REQUESTED_BY]?: string;
  [MAINTENANCE_PROPS.REQUESTED_BY_RESOLVED]?: IProfile;
  [MAINTENANCE_PROPS.REQUEST]?: string;
  [MAINTENANCE_PROPS.REQUEST_DATE]?: Date;
  [MAINTENANCE_PROPS.SERVICED_BY]?: string;
  [MAINTENANCE_PROPS.SERVICED_BY_RESOLVED]?: IProfile;
  [MAINTENANCE_PROPS.SERVICED_ON]?: Date;
  [MAINTENANCE_PROPS.SERVICE_DETAILS]?: string;
  [MAINTENANCE_PROPS.STATUS]?: MAINTENANCE_STATUS;
}

export interface IBoatMaintenanceResolveProfiles {
  [MAINTENANCE_PROPS.BOAT]?: IBoat;
  [MAINTENANCE_PROPS.BOAT_RESOLVED]?: IBoat;
  [MAINTENANCE_PROPS.COMMENTS]?: ICommentWithResolvedProfile[];
  [MAINTENANCE_PROPS.ID]?: string;
  [MAINTENANCE_PROPS.PICTURES]?: IMedia[];
  [MAINTENANCE_PROPS.REQUESTED_BY]?: IProfile;
  [MAINTENANCE_PROPS.REQUESTED_BY_RESOLVED]?: IProfile;
  [MAINTENANCE_PROPS.REQUEST]?: string;
  [MAINTENANCE_PROPS.REQUEST_DATE]?: Date;
  [MAINTENANCE_PROPS.SERVICED_BY]?: IProfile;
  [MAINTENANCE_PROPS.SERVICED_BY_RESOLVED]?: IProfile;
  [MAINTENANCE_PROPS.SERVICED_ON]?: Date;
  [MAINTENANCE_PROPS.SERVICE_DETAILS]?: string;
  [MAINTENANCE_PROPS.STATUS]?: MAINTENANCE_STATUS;
}
