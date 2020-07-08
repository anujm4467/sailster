export enum LOG_TYPE {
  ERROR = 'ERROR',
  HTTP_REQUEST = 'HTTP_REQUEST',
  INFO = 'INFO',
}

export enum LOG_PROPS {
  CREATED_AT = 'createdAt',
  DATA = 'data',
  ID = 'id',
  MESSAGE = 'message',
  TYPE = 'type',
  UPDATED_AT = 'updatedAt',
  USER = 'user',
}

export interface ILog {
  [LOG_PROPS.CREATED_AT]?: Date;
  [LOG_PROPS.DATA]?: any;
  [LOG_PROPS.ID]?: string;
  [LOG_PROPS.MESSAGE]?: any;
  [LOG_PROPS.TYPE]?: LOG_TYPE;
  [LOG_PROPS.UPDATED_AT]?: Date;
  [LOG_PROPS.USER]?: string;
}
