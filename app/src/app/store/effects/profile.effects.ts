import { of } from 'rxjs';
import {
  catchError,
  concatMap,
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
import { ProfileService } from '../../services/profile.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import {
  fetchProfile,
  fetchProfiles,
  fetchTotalProfileCount,
  putProfile,
  putProfiles,
  putTotalProfileCount,
  searchProfilesByNameOrEmail,
  updateProfileAccess,
  updateProfileInfo,
} from '../actions/profile.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class ProfileEffects {

  fetchCount$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(fetchTotalProfileCount),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          () => this.profileService.fetchTotalProfileCount()
            .pipe(
              map(count => putTotalProfileCount({ count }))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  fetchProfile$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchProfile),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.profileService.fetchOne(action.id)
          .pipe(
            map(profile => putProfile({ profile, id: action.id })),
            catchError(errorCatcher(`Failed to fetch profile: ${action.id}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchProfiles$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchProfiles),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.profileService.fetchProfiles(action.query)
          .pipe(
            mergeMap(profiles => of(
              putProfiles({ profiles }),
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: `Fetched ${profiles.length} profiles.` } }),
            )),
            catchError(errorCatcher(`Failed to fetch profiles: ${action.query}`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  searchProfilesByNameOrEmail$ = createEffect(
    () => this.actions$.pipe(
      ofType(searchProfilesByNameOrEmail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.profileService
          .searchByNameOrEmail(action.text)
          .pipe(
            mergeMap(profiles => of(
              putProfiles({ profiles }),
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: `Found ${profiles.length} profiles.` } }),
            )),
            catchError(errorCatcher(`Failed to search profiles: ${action.text}`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  updateProfileInfo$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateProfileInfo),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.profileService.updateInfo(action.id, action.profile)
          .pipe(
            mergeMap(profile => of(
              putProfile({ profile, id: action.id }),
              action.notify && putSnack({ snack: { message: 'saved', type: SnackType.INFO } }),
            )),
            catchError(errorCatcher(`Failed to update profile info: ${action.id}`))
          )),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  updateProfileAccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateProfileAccess),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.profileService
          .updateAccess(action.id, action.profile)
          .pipe(
            concatMap(profile => of(
              putProfile({ profile, id: action.id }),
              action.completeRequiredAction,
              action.notify && putSnack({ snack: { message: 'Updated profile access', type: SnackType.INFO } }),
            )),
            catchError(errorCatcher(`Failed to update profile access: ${action.id}`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(ProfileService) private profileService: ProfileService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
