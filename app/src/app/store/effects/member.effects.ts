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
  fetchMembers,
  fetchMembersBatch,
  putMembers,
} from '../actions/member.actions';
import { putProfiles } from '../actions/profile.actions';

@Injectable()
export class MemberEffects {

  fetchMembers$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchMembers),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        () => this.profileService.fetchMembers()
          .pipe(
            mergeMap((members) => {
              return of(putMembers({ members }), putProfiles({ profiles: members }));
            }),
            catchError(errorCatcher(`Failed to fetch members.`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchMembersBatch$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchMembersBatch),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.profileService.fetchProfileBatch(action.ids)
          .pipe(
            mergeMap((members) => {
              return of(putMembers({ members }), putProfiles({ profiles: members }));
            }),
            catchError(errorCatcher(`Failed to fetch members by ids.`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(ProfileService) private profileService: ProfileService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
