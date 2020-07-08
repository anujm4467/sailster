import { IProfile } from '../profile/profile.interface';

export enum MEDIA_PROPS {
  AUTHOR = 'author',
  COMMENT = 'comment',
  ID = 'id',
  _ID = '_id',
  URL = 'url',
}

export interface IMedia {
  [MEDIA_PROPS.AUTHOR]: string;
  [MEDIA_PROPS.COMMENT]: string;
  [MEDIA_PROPS.ID]: string;
  [MEDIA_PROPS._ID]: string;
  [MEDIA_PROPS.URL]: string;
}

export interface IMediaResolved {
  [MEDIA_PROPS.AUTHOR]: IProfile;
  [MEDIA_PROPS.COMMENT]: string;
  [MEDIA_PROPS.ID]: string;
  [MEDIA_PROPS._ID]: string;
  [MEDIA_PROPS.URL]: string;
}
