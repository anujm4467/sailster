import {
  createReducer,
  on,
  Action,
} from '@ngrx/store';
import {
  putSkipper,
  resetSkippers,
  putSkippers,
} from '../actions/skipper.actions';
import { IProfileState } from '../../models/profile-state.interface';

const initialState = {} as IProfileState;

const reducerHandler = createReducer(
  initialState,
  on(resetSkippers, () => initialState),
  on(putSkipper, (state, action) => {
    return Object.assign({}, state, { [action.id]: action.skipper });
  }),
  on(putSkippers, (state, action) => {
    const map = action
      .skippers
      .reduce(
        (reducer, skipper) => {
          reducer[skipper.id] = skipper;
          return reducer;
        },
        {},
      );

    return Object.assign({}, state, map);
  })
);

export function skipperReducer(state: IProfileState | undefined, action: Action) {
  return reducerHandler(state, action);
}
