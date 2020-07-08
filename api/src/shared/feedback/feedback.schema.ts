import * as mongoose from 'mongoose';
import { CommentSchema } from '../comment/comment.schema';
import { DB_MODELS } from '../db-models.enum';
import { FeedbackRating } from './feedback-rating';
import { FEEDBACK_PROPS } from './feedback.interface';

export const FeedbackSchema = {
  [FEEDBACK_PROPS.COMMENTS]: [CommentSchema],
  [FEEDBACK_PROPS.DATE]: { type: Date, default: Date.now },
  [FEEDBACK_PROPS.FEEDBACK]: String,
  [FEEDBACK_PROPS.FEEDBACK_FOR]: { type: mongoose.Schema.Types.ObjectId },
  [FEEDBACK_PROPS.FOR_TYPE]: { type: String, enum: Object.values(DB_MODELS), required: true },
  [FEEDBACK_PROPS.RATING]: { type: String, enum: Object.values(FeedbackRating), required: true },
};

export const FeedbackSchemaIndex = [
  {
    fields: {
      [FEEDBACK_PROPS.DATE]: -1,
    },
    options: {
      unique: false,
    },
  },
  {
    fields: {
      [FEEDBACK_PROPS.FEEDBACK_FOR]: -1,
    },
    options: {
      unique: false,
    },
  },
  {
    fields: {
      [FEEDBACK_PROPS.FOR_TYPE]: -1,
    },
    options: {
      unique: false,
    },
  },
];
