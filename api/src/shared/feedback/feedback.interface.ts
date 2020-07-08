import { IComment } from '../comment/comment.interface';
import { DB_MODELS } from '../db-models.enum';
import { FeedbackRating } from './feedback-rating';

export enum FEEDBACK_PROPS {
  COMMENTS = 'comments',
  DATE = 'date',
  FEEDBACK = 'feedback',
  FEEDBACK_FOR = 'feedbackFor',
  FOR_TYPE = 'forType',
  ID = 'id',
  RATING = 'rating',
}

export interface IFeedback {
  [FEEDBACK_PROPS.COMMENTS]: IComment[];
  [FEEDBACK_PROPS.DATE]: Date;
  [FEEDBACK_PROPS.FEEDBACK]: string;
  [FEEDBACK_PROPS.FEEDBACK_FOR]: string;
  [FEEDBACK_PROPS.FOR_TYPE]: DB_MODELS;
  [FEEDBACK_PROPS.ID]: string;
  [FEEDBACK_PROPS.RATING]: FeedbackRating;
}
