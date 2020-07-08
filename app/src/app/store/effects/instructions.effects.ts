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
import { InstructionsService } from '../../services/instructions.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import {
  fetchInstructionByBoat,
  putInstructions,
  fetchInstructionByType,
  updateInstructions,
  createInstructions,
} from '../actions/instructions.actions';
import { putSnack } from '../actions/snack.actions';
import { SnackType } from '../../models/snack-state.interface';

@Injectable()
export class InstructionsEffects {

  fetchInstructionsByBoat$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchInstructionByBoat),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.instructionsService
          .fetchInstructionsByBoat(action.boatId)
          .pipe(
            mergeMap(instructions => of(putInstructions({ instructions }))),
            catchError(errorCatcher(`Failed to fetch instructions for boat ${action.boatId}.`))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  fetchInstructionsByType$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchInstructionByType),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.instructionsService
          .fetchInstructionsByType(action.boatId, action.instructionsType)
          .pipe(
            mergeMap(instructions => of(putInstructions({ instructions }))),
            catchError(errorCatcher(`Failed to fetch instructions by type ${action.instructionsType}.`))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  updateInstructions$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateInstructions),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.instructionsService
          .updateInstructions(action.id, action.instructions)
          .pipe(
            mergeMap((instructions) => {
              if (action.notify) {
                return of(
                  putSnack({ snack: { message: 'Updated instructions', type: SnackType.INFO } }),
                  putInstructions({ instructions }),
                );
              }
              return of(putInstructions({ instructions }));
            }),
            catchError(errorCatcher(`Failed to update instructions ${action.id}.`))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  createInstructions$ = createEffect(
    () => this.actions$.pipe(
      ofType(createInstructions),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.instructionsService
          .createInstructions(action.instructions)
          .pipe(
            mergeMap((instructions) => {
              if (action.notify) {
                return of(
                  putSnack({ snack: { message: 'Created instructions', type: SnackType.INFO } }),
                  putInstructions({ instructions }),
                );
              }
              return of(putInstructions({ instructions }));
            }),
            catchError(errorCatcher(`Failed to create instructions ${action.instructions.instructionsType}.`))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(InstructionsService) private instructionsService: InstructionsService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
