import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
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
import { editMaintenanceRoute } from '../../routes/routes';
import { BoatMaintenanceService } from '../../services/boat-maintenance.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  createBoatMaintenance,
  fetchBoatMaintenance,
  fetchBoatMaintenances,
  postBoatMaintenanceComment,
  putBoatMaintenance,
  putBoatMaintenances,
  updateBoatMaintenance,
} from '../actions/boat-maintenance.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class BoatMaintenanceEffects {

  postBoatMaintenanceComment$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(postBoatMaintenanceComment),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.boatMaintenanceService
            .postMaintenanceComment(action.id, action.comment)
            .pipe(
              mergeMap(maintenance => of(
                putBoatMaintenance({ maintenance, id: maintenance.id }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Comment posted.' } }),
              )),
              catchError(errorCatcher('Failed to post comment.'))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  createBoatMaintenance$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(createBoatMaintenance),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.boatMaintenanceService
            .createMaintenaceRequest(action.maintenance)
            .pipe(
              mergeMap(maintenance => of(
                putBoatMaintenance({ maintenance, id: maintenance.id }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Boat Maintenance Request created.' } }),
                goTo({ route: editMaintenanceRoute(maintenance.id) }),
              )),
              catchError(errorCatcher('Failed to create maintenance request.'))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  updateBoatMaintenance$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(updateBoatMaintenance),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.boatMaintenanceService
            .updateMaintenanceRequest(action.id, action.maintenance)
            .pipe(
              mergeMap(maintenance => of(
                putBoatMaintenance({ maintenance, id: maintenance.id }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Maintenance request updated.' } }),
              )),
              catchError(errorCatcher(`'Failed to update maintenance request ${action.id}.`))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  fetchBoatMaintenances$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchBoatMaintenances),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.boatMaintenanceService
          .fetchMaintenanceRequests(action.query)
          .pipe(
            mergeMap(maintenances => of(
              putBoatMaintenances({ maintenances }),
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
            )),
            catchError(errorCatcher('Failed to fetch boat maintenances.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchBoatMaintenance$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchBoatMaintenance),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.boatMaintenanceService.fetchOne(action.id)
          .pipe(
            map(maintenance => putBoatMaintenance({ maintenance, id: action.id })),
            catchError(errorCatcher(`Failed to fetch boat maintenance: ${action.id}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(BoatMaintenanceService) private boatMaintenanceService: BoatMaintenanceService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
