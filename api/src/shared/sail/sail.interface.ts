import { IBoat } from '../boat/boat.interface';
import {
  IComment,
  ICommentWithResolvedProfile,
} from '../comment/comment.interface';
import { IProfile } from '../profile/profile.interface';
import { ISailChecklist } from '../sail-checklist/sail-checklist.interface';
import { SAIL_STATUS } from './sail-status';

export enum SAIL_PROPS {
  BOAT = 'boat',
  CANCELLED_BY = 'cancelledBy',
  CANCELLED_ON = 'cancelledOn',
  CANCEL_REASON = 'cancelReason',
  CHECKLIST = 'checklist',
  COMMENTS = 'comments',
  CREW = 'crew',
  DESCRIPTION = 'description',
  END = 'end',
  ID = 'id',
  MAX_OCCUPANCY = 'maxOccupancy',
  NAME = 'name',
  PASSENGERS = 'passengers',
  SKIPPER = 'skipper',
  START = 'start',
  STATUS = 'status',
}

export interface ISail {
  [SAIL_PROPS.BOAT]?: string;
  [SAIL_PROPS.CANCELLED_BY]?: string;
  [SAIL_PROPS.CANCELLED_ON]?: Date | string;
  [SAIL_PROPS.CANCEL_REASON]?: string;
  [SAIL_PROPS.CHECKLIST]?: string;
  [SAIL_PROPS.COMMENTS]?: IComment[];
  [SAIL_PROPS.CREW]?: string;
  [SAIL_PROPS.DESCRIPTION]?: string;
  [SAIL_PROPS.END]?: Date | string;
  [SAIL_PROPS.ID]?: string;
  [SAIL_PROPS.MAX_OCCUPANCY]?: number;
  [SAIL_PROPS.NAME]?: string;
  [SAIL_PROPS.PASSENGERS]?: string[];
  [SAIL_PROPS.SKIPPER]?: string;
  [SAIL_PROPS.START]?: Date | string;
  [SAIL_PROPS.STATUS]?: SAIL_STATUS;
}

export interface ISailResolved {
  [SAIL_PROPS.BOAT]?: IBoat;
  [SAIL_PROPS.CANCELLED_BY]?: IProfile;
  [SAIL_PROPS.CANCELLED_ON]?: Date | string;
  [SAIL_PROPS.CANCEL_REASON]?: string;
  [SAIL_PROPS.CHECKLIST]?: ISailChecklist;
  [SAIL_PROPS.COMMENTS]?: ICommentWithResolvedProfile[];
  [SAIL_PROPS.CREW]?: IProfile;
  [SAIL_PROPS.DESCRIPTION]?: string;
  [SAIL_PROPS.END]?: Date | string;
  [SAIL_PROPS.ID]?: string;
  [SAIL_PROPS.MAX_OCCUPANCY]?: number;
  [SAIL_PROPS.NAME]?: string;
  [SAIL_PROPS.PASSENGERS]?: IProfile[];
  [SAIL_PROPS.SKIPPER]?: IProfile;
  [SAIL_PROPS.START]?: Date | string;
  [SAIL_PROPS.STATUS]?: SAIL_STATUS;
}
