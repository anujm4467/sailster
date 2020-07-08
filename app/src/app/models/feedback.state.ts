import { IFeedback } from '../../../../api/src/shared/feedback/feedback.interface';

export interface Feedbacks {
  [propName: string]: IFeedback;
}

export interface FeedbackssFetching {
  [propName: string]: boolean;
}

export interface FeedbackState {
  fetching: FeedbackssFetching;
  feedbacks: Feedbacks;
}
