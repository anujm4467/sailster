import * as mongoose from 'mongoose';
import { DB_MODELS } from '../db-models.enum';
import { REQUIRED_ACTION_PROPS } from './required-action.interface';
import { REQUIRED_ACTION_STATE } from './required-action.state';
import { REQUIRED_ACTIONS } from './required-action.types';

export interface IRequiredActionSchema {
  [REQUIRED_ACTION_PROPS.ACTION_TYPE]: {
    type: StringConstructor;
    enum: REQUIRED_ACTIONS[];
    required: boolean;
  };
  [REQUIRED_ACTION_PROPS.ASSIGNED_BY]: {
    type: any;
    ref: DB_MODELS;
    required: boolean;
  };
  [REQUIRED_ACTION_PROPS.ASSIGNED_ON]: {
    type: DateConstructor;
    required: boolean;
  };
  [REQUIRED_ACTION_PROPS.ASSIGNED_TO]: {
    type: any;
    ref: DB_MODELS;
    required: boolean;
  };
  [REQUIRED_ACTION_PROPS.DATA]: ObjectConstructor;
  [REQUIRED_ACTION_PROPS.DESCRIPTION]: {
    type: StringConstructor;
    required: boolean;
  };
  [REQUIRED_ACTION_PROPS.DUE_DATE]: {
    type: DateConstructor;
    required: boolean;
  };
  [REQUIRED_ACTION_PROPS.STATE]: {
    type: StringConstructor;
    enum: REQUIRED_ACTION_STATE[];
    required: boolean;
  };
}

export const RequiredActionSchema: IRequiredActionSchema = {
  [REQUIRED_ACTION_PROPS.ACTION_TYPE]: { type: String, enum: Object.values(REQUIRED_ACTIONS), required: true },
  [REQUIRED_ACTION_PROPS.ASSIGNED_BY]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE, required: true },
  [REQUIRED_ACTION_PROPS.ASSIGNED_ON]: { type: Date, required: true },
  [REQUIRED_ACTION_PROPS.ASSIGNED_TO]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE, required: true },
  [REQUIRED_ACTION_PROPS.DATA]: Object,
  [REQUIRED_ACTION_PROPS.DESCRIPTION]: { type: String, required: true },
  [REQUIRED_ACTION_PROPS.DUE_DATE]: { type: Date, required: false },
  [REQUIRED_ACTION_PROPS.STATE]: { type: String, enum: Object.values(REQUIRED_ACTION_STATE), required: true },
};

export const RequiredActionSchemaIndex = [
  {
    fields: {
      [REQUIRED_ACTION_PROPS.ASSIGNED_TO]: -1,
    },
  },
  {
    fields: {
      [REQUIRED_ACTION_PROPS.STATE]: -1,
    },
  },
  {
    fields: {
      [REQUIRED_ACTION_PROPS.DUE_DATE]: -1,
    },
  },
];
