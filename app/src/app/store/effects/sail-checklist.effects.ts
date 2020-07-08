import { of } from 'rxjs';
import {
  catchError,
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
import { SailChecklistService } from '../../services/sail-checklist.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import {
  createSailChecklist,
  fetchSailChecklist,
  findSailChecklists,
  putSailChecklist,
  putSailChecklists,
  updateSailChecklist,
} from '../actions/sail-checklist.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class SailChecklistEffects {

  createSailChecklist$ = createEffect(
    () => this.actions$.pipe(
      ofType(createSailChecklist),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailChecklistService.create(action.checklist)
          .pipe(
            mergeMap(checklist => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'Sail checklist created!' } }),
              putSailChecklist({ checklist, id: checklist.id })
            )),
            catchError(errorCatcher('Failed to create sail checklist')),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  updateSailChecklist$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateSailChecklist),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailChecklistService.update(action.id, action.checklist)
          .pipe(
            mergeMap(checklist => of(
              putSailChecklist({ checklist, id: action.id }),
              ...(action.updateActions || []),
              putSnack({ snack: { type: SnackType.INFO, message: 'Saved' } }),
            )),
            catchError(errorCatcher(`Failed to update sail checklist: ${action.id}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchSailChecklist$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSailChecklist),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailChecklistService.fetchOne(action.id)
          .pipe(
            mergeMap((checklist) => {
              if (action.notify) {
                return of(
                  putSailChecklist({ checklist, id: action.id }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
                );
              }
              return of(putSailChecklist({ checklist, id: action.id }));
            }),
            catchError(
              errorCatcher(`Failed to fetch sail checklist: ${action.id}`, [putSailChecklist({ checklist: null, id: action.id })])),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  findSailChecklists$ = createEffect(
    () => this.actions$.pipe(
      ofType(findSailChecklists),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailChecklistService.find(action.query)
          .pipe(
            mergeMap((checklists) => {
              return of(putSailChecklists({ checklists }));
            }),
            catchError(
              errorCatcher('Failed to find sail checklists')),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailChecklistService) private sailChecklistService: SailChecklistService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
