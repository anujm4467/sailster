import {
  EMPTY,
  of,
} from 'rxjs';
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
import {
  arrivalSailChecklistRoute,
  departureSailChecklistRoute,
  viewSailRoute,
} from '../../routes/routes';
import { SailService } from '../../services/sail.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  cancelSail,
  completeSail,
  createSail,
  fetchSail,
  fetchSails,
  joinSailAsCrew,
  joinSailAsPassenger,
  joinSailAsSkipper,
  leaveSail,
  postSailComment,
  putSail,
  putSails,
  putSailSearchResults,
  searchSails,
  startSail,
  updateSail,
} from '../actions/sail.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class SailEffects {

  startSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(startSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .startSail(action.sail.id)
          .pipe(
            mergeMap(sail => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You started this sail!' } }),
              putSail({ sail, id: action.sail.id }),
              goTo({ route: departureSailChecklistRoute(sail.checklist) })
            )),
            catchError(errorCatcher('Failed to start the sail.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  completeSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(completeSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .completeSail(action.sail.id)
          .pipe(
            mergeMap(sail => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You completed this sail!' } }),
              putSail({ sail, id: action.sail.id }),
              goTo({ route: arrivalSailChecklistRoute(sail.checklist) })
            )),
            catchError(errorCatcher('Failed to complete the sail.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  cancelSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(cancelSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .cancelSail(action.id, action.sail)
          .pipe(
            mergeMap(sail => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You cancelled this sail!' } }),
              putSail({ sail, id: action.id })
            )),
            catchError(errorCatcher('Failed to cancel the sail.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  joinSailAsCrew$ = createEffect(
    () => this.actions$.pipe(
      ofType(joinSailAsCrew),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .joinAsCrew(action.sailId)
          .pipe(
            mergeMap(sail => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You joined the sail as crew!' } }),
              putSail({ sail, id: action.sailId })
            )),
            catchError(errorCatcher('Failed to join sail as crew'))
          ),
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  joinSailAsPassenger$ = createEffect(
    () => this.actions$.pipe(
      ofType(joinSailAsPassenger),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .joinAsPassenger(action.sailId)
          .pipe(
            mergeMap(sail => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'You joined the sail as a passanger!' } }),
              putSail({ sail, id: action.sailId })
            )),
            catchError(errorCatcher('Failed to join sail as passenger'))
          ),
      ),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  joinSailAsSkipper$ = createEffect(
    () => this.actions$.pipe(
      ofType(joinSailAsSkipper),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .joinAsSkipper(action.sailId)
          .pipe(
            mergeMap(sail => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'You joined the sail as a skipper!' } }),
              putSail({ sail, id: action.sailId })
            )),
            catchError(errorCatcher('Failed to join sail as skipper'))
          ),
      ),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  leaveSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(leaveSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .leaveSail(action.sailId)
          .pipe(
            mergeMap(sail => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'You left the sail!' } }),
              putSail({ sail, id: action.sailId })
            )),
            catchError(errorCatcher('Failed to leave sail'))
          ),
      ),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  postSailComment$ = createEffect(
    () => this.actions$.pipe(
      ofType(postSailComment),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.postNewComment(action.sailId, action.comment)
          .pipe(
            mergeMap(sail => of(
              (action.notify ? putSnack({ snack: { type: SnackType.INFO, message: 'Comment posted' } }) : EMPTY),
              putSail({ sail, id: action.sailId }),
            )),
            catchError(errorCatcher(`Failed to post comment to sail: ${action.sailId}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  createSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(createSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.create(action.sail)
          .pipe(
            mergeMap(sail => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'Sail created!' } }),
              putSail({ sail, id: sail.id }),
              goTo({ route: viewSailRoute(sail.id) }),
            )),
            catchError(errorCatcher(`Failed to create sail: ${action.sail.name}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  updateSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.update(action.id, action.sail)
          .pipe(
            mergeMap(sail => of(
              putSail({ sail, id: action.id }),
              ...(action.updateActions || []),
              putSnack({ snack: { type: SnackType.INFO, message: 'Saved' } }),
            )),
            catchError(errorCatcher(`Failed to update sail: ${action.id}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  searchSails$ = createEffect(
    () => this.actions$.pipe(
      ofType(searchSails),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.search(action.query)
          .pipe(
            mergeMap((sails) => {
              if (action.notify) {
                return of(
                  putSailSearchResults({ sails }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
                );
              }
              return of(putSailSearchResults({ sails }));
            }),
            catchError(errorCatcher(`Failed to fetch sails`, [putSailSearchResults({ sails: [] })]))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchSails$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSails),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchAll(action.query)
          .pipe(
            mergeMap((sails) => {
              if (action.notify) {
                return of(
                  putSails({ sails }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
                );
              }
              return of(putSails({ sails }));
            }),
            catchError(errorCatcher(`Failed to fetch sails`, [putSails({ sails: [] })]))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchOne(action.id)
          .pipe(
            mergeMap((sail) => {
              if (action.notify) {
                return of(
                  putSail({ sail, id: action.id }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
                );
              }
              return of(putSail({ sail, id: action.id }));
            }),
            catchError(errorCatcher(`Failed to fetch sail: ${action.id}`, [putSail({ sail: null, id: action.id })])),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailService) private sailService: SailService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
