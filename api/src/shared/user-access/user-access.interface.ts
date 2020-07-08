export enum USER_ACCESS_FIELDS {
  CREATE_BOAT = 'createBoat',
  CREATE_CHALLENGE = 'createChallenge',
  CREATE_CLINIC = 'createClinic',
  CREATE_SAIL = 'createSail',
  CREATE_SAIL_REQUEST = 'createSailRequest',
  DELETE_PICTURES = 'deletePictures',
  EDIT_BOAT = 'editBoat',
  EDIT_CHALLENGE = 'editChallenge',
  EDIT_CLINIC = 'editClinic',
  EDIT_MAINTENANCE_REQUEST = 'editMaintenanceRequest',
  EDIT_SAIL = 'editSail',
  EDIT_SAIL_REQUEST = 'editSailRequest',
  EDIT_USER_ACCESS = 'editUserAccess',
  EDIT_USER_PROFILE = 'editUserProfile',
  RESOLVE_MAINTENANCE_REQUEST = 'resolveMaintenanceRequest',
  VIEW_CHALLENGE_ACCOMPLISHEMENTS = 'viewChallengeAccomplishments',
  VIEW_LOGS = 'viewLogs',
  VIEW_USER_SAILS = 'viewUserSails',
}

export interface IAccess {
  [propName: string]: boolean;
  [USER_ACCESS_FIELDS.CREATE_BOAT]?: boolean;
  [USER_ACCESS_FIELDS.CREATE_CHALLENGE]?: boolean;
  [USER_ACCESS_FIELDS.CREATE_CLINIC]?: boolean;
  [USER_ACCESS_FIELDS.CREATE_SAIL]?: boolean;
  [USER_ACCESS_FIELDS.CREATE_SAIL_REQUEST]?: boolean;
  [USER_ACCESS_FIELDS.DELETE_PICTURES]?: boolean;
  [USER_ACCESS_FIELDS.EDIT_BOAT]?: boolean;
  [USER_ACCESS_FIELDS.EDIT_CHALLENGE]?: boolean;
  [USER_ACCESS_FIELDS.EDIT_CLINIC]?: boolean;
  [USER_ACCESS_FIELDS.EDIT_MAINTENANCE_REQUEST]?: boolean;
  [USER_ACCESS_FIELDS.EDIT_SAIL]?: boolean;
  [USER_ACCESS_FIELDS.EDIT_SAIL_REQUEST]?: boolean;
  [USER_ACCESS_FIELDS.EDIT_USER_ACCESS]?: boolean;
  [USER_ACCESS_FIELDS.EDIT_USER_PROFILE]?: boolean;
  [USER_ACCESS_FIELDS.RESOLVE_MAINTENANCE_REQUEST]?: boolean;
  [USER_ACCESS_FIELDS.VIEW_CHALLENGE_ACCOMPLISHEMENTS]?: boolean;
  [USER_ACCESS_FIELDS.VIEW_LOGS]?: boolean;
  [USER_ACCESS_FIELDS.VIEW_USER_SAILS]?: boolean;
}

export interface IUserAccess {
  _id?: string;
  access?: IAccess;
}
