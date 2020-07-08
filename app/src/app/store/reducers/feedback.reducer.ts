import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { FeedbackState } from '../../models/feedback.state';
import {
  putFeedback,
  putFeedbacks,
  resetFeedback,
} from '../actions/feedback.actions';

const initialState: FeedbackState = {
  fetching: {},
  feedbacks: {},
};

const reducerHandler = createReducer(
  initialState,
  on(resetFeedback, () => initialState),
  on(putFeedbacks, (state, action) => {
    const existingFeedback = Object.assign({}, state.feedbacks);
    const newActions = action
      .feedbacks
      .reduce(
        (red, ra) => {
          red[ra.id] = ra;
          return red;
        },
        existingFeedback,
      );
    return Object.assign({}, state, { feedbacks: newActions } as FeedbackState);
  }),
  on(putFeedback, (state, action) => {
    const existingFeedback = Object.assign({}, state.feedbacks);
    existingFeedback[action.feedbackId] = action.feedback;
    return Object.assign({}, state, { feedbacks: existingFeedback } as FeedbackState);
  }),
);

export function feedbackReducer(state: FeedbackState, action: Action) {
  return reducerHandler(state, action);
}
