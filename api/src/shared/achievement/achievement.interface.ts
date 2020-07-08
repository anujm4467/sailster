export enum ACHIEVEMENT_PROPS {
  ACHIEVED_BY = 'achievedBy',
  BADGE = 'badge',
  CLINIC = 'clinic',
  GIVEN_BY = 'givenBy',
  GIVEN_ON = 'givenOn',
  ID = 'id',
  TITLE = 'title',
  _ID = '_id',
}

export interface IAchivement {
  [ACHIEVEMENT_PROPS.ACHIEVED_BY]: string;
  [ACHIEVEMENT_PROPS.BADGE]: string;
  [ACHIEVEMENT_PROPS.CLINIC]: string;
  [ACHIEVEMENT_PROPS.GIVEN_BY]: string;
  [ACHIEVEMENT_PROPS.GIVEN_ON]: Date | string;
  [ACHIEVEMENT_PROPS.ID]: string;
  [ACHIEVEMENT_PROPS.TITLE]: string;
  [ACHIEVEMENT_PROPS._ID]: string;
}
