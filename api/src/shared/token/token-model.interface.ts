export enum TOKEN_MODEL_PROPS {
  CREATED_ON = 'createdOn',
  EXPIRE_AT = 'expireAt',
  ID = 'id',
  PROFILE_ID = 'profileId',
  PROVIDER = 'provider',
  TOKEN = 'token',
  UPDATED_ON = 'updatedOn',
}

export interface ITokenModel {
  [TOKEN_MODEL_PROPS.CREATED_ON]?: Date;
  [TOKEN_MODEL_PROPS.EXPIRE_AT]: Date;
  [TOKEN_MODEL_PROPS.ID]?: string;
  [TOKEN_MODEL_PROPS.PROFILE_ID]: string;
  [TOKEN_MODEL_PROPS.PROVIDER]: string;
  [TOKEN_MODEL_PROPS.TOKEN]: string;
  [TOKEN_MODEL_PROPS.UPDATED_ON]?: Date;
}
