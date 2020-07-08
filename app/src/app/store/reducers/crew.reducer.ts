import {
  createReducer,
  on,
  Action,
} from '@ngrx/store';
import {
  putCrew,
  resetCrew,
  putCrewPerson,
} from '../actions/crew.actions';
import { IProfileState } from '../../models/profile-state.interface';

const initialState = {} as IProfileState;

const reducerHandler = createReducer(
  initialState,
  on(resetCrew, () => initialState),
  on(putCrewPerson, (state, action) => {
    return Object.assign({}, state, { [action.id]: action.crew });
  }),
  on(putCrew, (state, action) => {
    const map = action
      .crew
      .reduce(
        (reducer, crew) => {
          reducer[crew.id] = crew;
          return reducer;
        },
        {},
      );

    return Object.assign({}, state, map);
  })
);

export function crewReducer(state: IProfileState | undefined, action: Action) {
  return reducerHandler(state, action);
}
