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
import { ProfileService } from '../../services/profile.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import {
  fetchCrew,
  fetchCrewPerson,
  putCrew,
  putCrewPerson,
} from '../actions/crew.actions';
import {
  putProfile,
  putProfiles,
} from '../actions/profile.actions';

@Injectable()
export class CrewEffects {

  fetchCrew$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchCrew),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        () => this.profileService.fetchCrew()
          .pipe(
            mergeMap((crew) => {
              return of(putCrew({ crew }), putProfiles({ profiles: crew }));
            }),
            catchError(errorCatcher(`Failed to fetch crew.`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ));

  fetchCrewPerson$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchCrewPerson),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.profileService.fetchOne(action.id)
          .pipe(
            mergeMap((crew) => {
              return of(putCrewPerson({ crew, id: action.id }), putProfile({ profile: crew, id: action.id }));
            }),
            catchError(errorCatcher(`Failed to fetch crew: ${action.id}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ));

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(ProfileService) private profileService: ProfileService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
