import { IComment } from '../comment/comment.interface';
import { IMedia } from '../media/media.interface';

export enum CHALLENGE_PROPS {
  COMMENTS = 'comments',
  COMPLETED_BY = 'completedBy',
  DESCRIPTION = 'description',
  DUE_DATE = 'dueDate',
  ID = 'id',
  PICTURES = 'pictures',
  STATUS = 'status',
  TITLE = 'title',
}

export enum CHALLENGE_STATUS {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface IChallenger {
  profile: string;
  completedOn: Date;
}

export interface IChallenge {
  [CHALLENGE_PROPS.COMMENTS]?: IComment[];
  [CHALLENGE_PROPS.COMPLETED_BY]?: IChallenger[];
  [CHALLENGE_PROPS.DESCRIPTION]?: string;
  [CHALLENGE_PROPS.DUE_DATE]?: Date;
  [CHALLENGE_PROPS.ID]?: string;
  [CHALLENGE_PROPS.PICTURES]?: IMedia[];
  [CHALLENGE_PROPS.STATUS]?: CHALLENGE_STATUS;
  [CHALLENGE_PROPS.TITLE]?: string;
}
