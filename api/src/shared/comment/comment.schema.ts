import * as mongoose from 'mongoose';
import { COMMENT_PROPS } from './comment.interface';
import { DB_MODELS } from '../db-models.enum';

export interface ICommentSchema {
  [COMMENT_PROPS.AUTHOR]: { type: any, ref: string };
  [COMMENT_PROPS.COMMENT]: StringConstructor;
  [COMMENT_PROPS.DATE]: DateConstructor;
}

export const CommentSchema: ICommentSchema = {
  [COMMENT_PROPS.AUTHOR]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  [COMMENT_PROPS.COMMENT]: String,
  [COMMENT_PROPS.DATE]: Date,
};
