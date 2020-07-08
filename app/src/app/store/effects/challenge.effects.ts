import { of } from 'rxjs';
import {
  catchError,
  concatMap,
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
import { editChallengeRoute } from '../../routes/routes';
import { ChallengeService } from '../../services/challenge.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  completeUserChallenge,
  createChallenge,
  deleteChallengePicture,
  fetchChallenge,
  fetchChallenges,
  postChallengeComment,
  postChallengePictures,
  putChallenge,
  putChallenges,
  updateChallenge,
} from '../actions/challenge.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class ChallengeEffects {

  completeUserChallenge$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(completeUserChallenge),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.service
            .completeUserChallenge(action.challengeId, action.challenger)
            .pipe(
              concatMap(returnedChallenge => of(
                putChallenge({ challengeId: action.challengeId, challenge: returnedChallenge }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: `You have accomplished this challenge.` } }),
              )),
              catchError(errorCatcher(`Failed to save challenge accomplishment.`))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  postChallengeComment$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(postChallengeComment),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.service
            .postChallengeComment(action.challengeId, action.comment)
            .pipe(
              concatMap(returnedChallenge => of(
                putChallenge({ challengeId: action.challengeId, challenge: returnedChallenge }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: `Post challenge comment.` } }),
              )),
              catchError(errorCatcher(`Failed to post challenge comment.`))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  deleteChallengePicture$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(deleteChallengePicture),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.service
            .deleteChallengePicture(action.challengeId, action.pictureId)
            .pipe(
              concatMap(returnedChallenge => of(
                putChallenge({ challengeId: action.challengeId, challenge: returnedChallenge }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: `Delete challenge picture ${action.pictureId}.` } }),
              )),
              catchError(errorCatcher(`Failed to delete challenge picture ${action.pictureId}.`))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  postChallengePictures$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(postChallengePictures),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.service
            .postChallengePictures(action.challengeId, action.pictures)
            .pipe(
              concatMap(returnedChallenge => of(
                putChallenge({ challengeId: action.challengeId, challenge: returnedChallenge }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: `Posted ${action.pictures.length} pictures.` } }),
              )),
              catchError(errorCatcher(`Failed to post challenge pictures ${action.challengeId}.`))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  fetchChallenge$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(fetchChallenge),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.service
            .fetchChallenge(action.challengeId)
            .pipe(
              concatMap(returnedChallenge => of(
                putChallenge({ challengeId: action.challengeId, challenge: returnedChallenge }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Challenge fetched.' } }),
              )),
              catchError(errorCatcher(`Failed to fetch challenge ${action.challengeId}.`))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  fetchChallenges$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(fetchChallenges),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.service
            .fetchChallenges(action.query)
            .pipe(
              concatMap(returnedChallenges => of(
                putChallenges({ challenges: returnedChallenges }),
                action.notify && putSnack({ snack: { message: 'Fetch challenges', type: SnackType.INFO } }),
              )),
              catchError(errorCatcher(`Failed to challenges.`))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  createChallenge$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(createChallenge),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.service
            .createChallenge(action.challenge)
            .pipe(
              concatMap(returnedChallenge => of(
                putChallenge({ challengeId: returnedChallenge.id, challenge: returnedChallenge }),
                goTo({ route: editChallengeRoute(returnedChallenge.id) }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Challenge created.' } }),
              )),
              catchError(errorCatcher(`Failed to create challenge.`))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  updateChallenge$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(updateChallenge),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.service
            .updateChallenge(action.challengeId, action.challenge)
            .pipe(
              concatMap(returnedChallenge => of(
                putChallenge({ challengeId: returnedChallenge.id, challenge: returnedChallenge }),
                goTo({ route: editChallengeRoute(returnedChallenge.id) }),
                action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Challenge updated.' } }),
              )),
              catchError(errorCatcher(`Failed to update challenge ${action.challengeId}.`))
            )
        ),
        filter(action => action && action.type),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(ChallengeService) private service: ChallengeService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
