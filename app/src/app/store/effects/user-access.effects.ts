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
import { UserAccessService } from '../../services/user-access.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import { putSnack } from '../actions/snack.actions';
import {
  fetchUserAccess,
  putUserAccess,
  updateUserAccess,
} from '../actions/user-access.actions';

@Injectable()
export class UserAccessEffects {

  fetchUserAccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchUserAccess),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.userAccessService.getUserAccess(action.profileId)
          .pipe(
            map(returnedAccess => putUserAccess({ profileId: action.profileId, access: returnedAccess })),
            catchError(errorCatcher(`Failed to fetch user access: ${action.profileId}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  updateUserAccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateUserAccess),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.userAccessService.updateUserAccess(action.profileId, action.access)
          .pipe(
            mergeMap(returnedAccess => of(
              putUserAccess({ profileId: action.profileId, access: returnedAccess }),
              action.notify && putSnack({ snack: { message: 'saved', type: SnackType.INFO } }),
            )),
            catchError(errorCatcher(`Failed to update user access: ${action.profileId}`))
          )),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(UserAccessService) private userAccessService: UserAccessService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
