import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  mergeMap,
  tap,
} from 'rxjs/operators';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SnackType } from '../../models/snack-state.interface';
import { FeedbackService } from '../../services/feedback.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  fetchFeedbacksForSail,
  putFeedback,
  putFeedbacks,
  submitFeedback,
} from '../actions/feedback.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class FeedbackEffects {

  fetchFeedbacksForSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchFeedbacksForSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service
          .fetchFeedbacksForSail(action.sailId)
          .pipe(
            concatMap(returnedFeedbacks => of(putFeedbacks({ feedbacks: returnedFeedbacks }))),
            catchError(errorCatcher(`Failed to fetch feedbacks for sail ${action.sailId}.`))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  submitFeedback$ = createEffect(
    () => this.actions$.pipe(
      ofType(submitFeedback),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service.submitFeedback(action.feedback)
          .pipe(
            concatMap(returnedFeedback => of(
              putFeedback({ feedbackId: returnedFeedback.id, feedback: returnedFeedback }),
              action.completeRequiredAction,
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Feedback submitted.' } }),
              goTo({ route: '/' }),
            )),
            catchError(errorCatcher(`Failed to submit feedback for ${action.feedback.feedbackFor}.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(FeedbackService) private service: FeedbackService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
