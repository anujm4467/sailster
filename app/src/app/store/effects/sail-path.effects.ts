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
import { editSailPathRoute } from '../../routes/routes';
import { SailPathService } from '../../services/sail-path.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  addSailPathPositions,
  createSailPath,
  fetchSailPathsForSail,
  putSailPath,
  putSailPaths,
  updateSailPath,
} from '../actions/sail-path.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class SailPathEffects {

  createSailPath$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(createSailPath),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailPathService
            .createSailPath(action.sailPath)
            .pipe(
              mergeMap(sailPath => of(
                putSailPath({ sailPath, sailPathId: sailPath.id }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Created sail path.' } }),
                action.goToEdit && goTo({ route: editSailPathRoute(sailPath.id) }),
                action.completeRequiredAction,
              )),
              catchError(errorCatcher('Failed to create sail path.'))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  updateSailPath$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(updateSailPath),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailPathService
            .updateSailPath(action.sailPathId, action.sailPath)
            .pipe(
              mergeMap(sailPath => of(
                putSailPath({ sailPath, sailPathId: sailPath.id }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Updated sail path.' } }),
                action.completeRequiredAction,
              )),
              catchError(errorCatcher('Failed to update sail path.'))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  fetchSailPathsForSail$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(fetchSailPathsForSail),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailPathService
            .fetchSailPathsForSail(action.sailId)
            .pipe(
              mergeMap(sailPaths => of(
                putSailPaths({ sailPaths }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Fetched sail paths for sail.' } }),
              )),
              catchError(errorCatcher('Failed to fetch sail paths for sail.'))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  addSailPathPositiions$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(addSailPathPositions),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailPathService
            .addSailPathPositions(action.sailPathId, action.positions)
            .pipe(
              mergeMap(() => of(
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Sail path positions saved.' } }),
              )),
              catchError(errorCatcher('Failed to save sail path positions.'))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailPathService) private sailPathService: SailPathService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
