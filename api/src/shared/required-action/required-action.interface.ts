import { REQUIRED_ACTION_STATE } from './required-action.state';
import { REQUIRED_ACTIONS } from './required-action.types';

export enum REQUIRED_ACTION_PROPS {
  ACTION_TYPE = 'actionType',
  ASSIGNED_BY = 'assignedBy',
  ASSIGNED_ON = 'assignedOn',
  ASSIGNED_TO = 'assignedTo',
  DATA = 'data',
  DESCRIPTION = 'description',
  DUE_DATE = 'dueDate',
  ID = 'id',
  STATE = 'state',
}

export interface IRequiredAction {
  [REQUIRED_ACTION_PROPS.ACTION_TYPE]?: REQUIRED_ACTIONS;
  [REQUIRED_ACTION_PROPS.ASSIGNED_BY]?: string;
  [REQUIRED_ACTION_PROPS.ASSIGNED_ON]?: Date;
  [REQUIRED_ACTION_PROPS.ASSIGNED_TO]?: string;
  [REQUIRED_ACTION_PROPS.DATA]?: any;
  [REQUIRED_ACTION_PROPS.DESCRIPTION]?: string;
  [REQUIRED_ACTION_PROPS.DUE_DATE]?: Date;
  [REQUIRED_ACTION_PROPS.ID]?: string;
  [REQUIRED_ACTION_PROPS.STATE]?: REQUIRED_ACTION_STATE;
}
