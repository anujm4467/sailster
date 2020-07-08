import { of } from 'rxjs';
import {
  catchError,
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
import { ProfileService } from '../../services/profile.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import { putProfiles } from '../actions/profile.actions';
import {
  fetchSkipper,
  fetchSkippers,
  putSkipper,
  putSkippers,
} from '../actions/skipper.actions';

@Injectable()
export class SkipperEffects {

  fetchSkippers$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSkippers),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        () => this.profileService.fetchSkippers()
          .pipe(
            mergeMap((skippers) => {
              return of(putSkippers({ skippers }), putProfiles({ profiles: skippers }));
            }),
            catchError(errorCatcher('Failed to fetch skippers')),
          )),
      tap(() => this.store.dispatch(finishLoading())),

    )
  );

  fetchSkipper$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSkipper),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.profileService.fetchOne(action.id)
          .pipe(
            map(skipper => putSkipper({ skipper, id: action.id })),
            catchError(errorCatcher(`Failed to fetch skipper: ${action.id}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(ProfileService) private profileService: ProfileService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
