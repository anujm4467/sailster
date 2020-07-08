import * as mongoose from 'mongoose';
import {
  CommentSchema,
  ICommentSchema,
} from '../comment/comment.schema';
import { DB_MODELS } from '../db-models.enum';
import {
  IPositionSchema,
  PositionSchema,
} from './position.schema';
import { SAIL_PATH_PROPS } from './sail-path.interface';

export interface ISailPathSchema {
  [SAIL_PATH_PROPS.SAIL]: {
    type: any;
    ref: string;
  };
  [SAIL_PATH_PROPS.POSITIONS]: IPositionSchema[];
  [SAIL_PATH_PROPS.SUBMITTED_BY]: {
    type: any;
    ref: string;
  };
  [SAIL_PATH_PROPS.COMMENTS]: ICommentSchema[];
  [SAIL_PATH_PROPS.DESCRIPTION]: StringConstructor;
  [SAIL_PATH_PROPS.SUBMITTED_ON]: DateConstructor;
}

export const SailPathSchema: ISailPathSchema = {
  comments: [CommentSchema],
  description: String,
  positions: [PositionSchema],
  sail: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.SAIL },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  submittedOn: Date,
};

export const SailPathSchemaIndex = [
  {
    fields: {
      [SAIL_PATH_PROPS.SAIL]: -1,
    },
    options: {
      unique: false,
    },
  },
  {
    fields: {
      [SAIL_PATH_PROPS.SUBMITTED_BY]: -1,
    },
    options: {
      unique: false,
    },
  },
];
