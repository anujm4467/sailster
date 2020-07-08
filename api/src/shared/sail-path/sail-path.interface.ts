import { IComment } from '../comment/comment.interface';
import { IPosition } from './position.interface';

export enum SAIL_PATH_PROPS {
  COMMENTS = 'comments',
  DESCRIPTION = 'description',
  ID = 'id',
  POSITIONS = 'positions',
  SAIL = 'sail',
  SUBMITTED_BY = 'submittedBy',
  SUBMITTED_ON = 'submittedOn',
}

export interface ISailPath {
  [SAIL_PATH_PROPS.COMMENTS]?: IComment[];
  [SAIL_PATH_PROPS.DESCRIPTION]?: string;
  [SAIL_PATH_PROPS.ID]?: string;
  [SAIL_PATH_PROPS.POSITIONS]?: IPosition[];
  [SAIL_PATH_PROPS.SAIL]?: string;
  [SAIL_PATH_PROPS.SUBMITTED_BY]?: string;
  [SAIL_PATH_PROPS.SUBMITTED_ON]?: Date;
}
