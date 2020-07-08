import { IProfile } from '../profile/profile.interface';

export enum COMMENT_PROPS {
  AUTHOR = 'author',
  COMMENT = 'comment',
  DATE = 'date',
  ID = 'id',
  _ID = '_id',
}

export interface IComment {
  [COMMENT_PROPS.AUTHOR]: string;
  [COMMENT_PROPS.COMMENT]: string;
  [COMMENT_PROPS.DATE]: Date;
  [COMMENT_PROPS.ID]?: string;
  [COMMENT_PROPS._ID]?: string;
}

export interface ICommentWithResolvedProfile {
  [COMMENT_PROPS.AUTHOR]: IProfile;
  [COMMENT_PROPS.COMMENT]: string;
  [COMMENT_PROPS.DATE]: Date;
  [COMMENT_PROPS.ID]?: string;
  [COMMENT_PROPS._ID]?: string;
}
