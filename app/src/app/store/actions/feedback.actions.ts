import {
  Action,
  createAction,
  props,
} from '@ngrx/store';
import { IFeedback } from '../../../../../api/src/shared/feedback/feedback.interface';

export enum FEEDBACK_ACTION_TYPES {
  FETCH_FEEDBACK = '[Feedback] Fetch feedback',
  FETCH_FEEDBACKS_FOR_SAIL = '[Feedback] Fetch feedbacks for sail',
  PUT_FEEDBACK = '[Feedback] Put feedback',
  PUT_FEEDBACKS = '[Feedback] Put feedbacks',
  RESET = 'Reset',
  SUBMIT_FEEDBACK = '[Feedback] Submit feedback',
}

export const fetchFeedback = createAction(FEEDBACK_ACTION_TYPES.FETCH_FEEDBACK, props<{feedbackId: string}>());
export const fetchFeedbacksForSail = createAction(FEEDBACK_ACTION_TYPES.FETCH_FEEDBACKS_FOR_SAIL, props<{sailId: string}>());
export const putFeedback = createAction(FEEDBACK_ACTION_TYPES.PUT_FEEDBACK, props<{feedbackId: string, feedback: IFeedback}>());
export const putFeedbacks = createAction(FEEDBACK_ACTION_TYPES.PUT_FEEDBACKS, props<{feedbacks: IFeedback[]}>());
export const resetFeedback = createAction(FEEDBACK_ACTION_TYPES.RESET);
export const submitFeedback = createAction(
  FEEDBACK_ACTION_TYPES.SUBMIT_FEEDBACK, props<{feedback: IFeedback, notify: boolean, completeRequiredAction: Action}>());
