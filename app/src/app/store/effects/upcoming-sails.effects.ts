import { of } from 'rxjs';
import {
  catchError,
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
import { SailService } from '../../services/sail.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import { putSnack } from '../actions/snack.actions';
import {
  fetchUpcomingSailsForAll,
  fetchUpcomingSailsForUser,
  putUpcomingSailsForAll,
  putUpcomingSailsForUser,
} from '../actions/upcoming-sails.actions';

@Injectable()
export class UpcomingSailsEffects {

  fetchUpcomingSailsForAll$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchUpcomingSailsForAll),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchUpcomingSailsForAll(action.query)
          .pipe(
            mergeMap(sails => of(
              putUpcomingSailsForAll({ sails }),
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
            )),
            catchError(errorCatcher('Failed to get upcoming sails.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  fetchUpcomingSailsForUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchUpcomingSailsForUser),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchUpcomingSailsForUser(action.id, action.query)
          .pipe(
            mergeMap(sails => of(
              putUpcomingSailsForUser({ sails, id: action.id }),
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
            )),
            catchError(errorCatcher('Failed to get your upcoming sails.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailService) private sailService: SailService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
