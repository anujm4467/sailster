import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { SailPathsState } from '../../models/sail-paths.state';
import {
  putSailPath,
  putSailPaths,
  resetSailPaths,
} from '../actions/sail-path.actions';

const initialState: SailPathsState = {
  fetching: {},
  sailPaths: {},
};

const reducerHandler = createReducer(
  initialState,
  on(resetSailPaths, () => initialState),
  on(putSailPaths, (state, action) => {
    const existingValues = Object.assign({}, state.sailPaths);
    const newValues = action
      .sailPaths
      .reduce(
        (red, ra) => {
          red[ra.id] = ra;
          return red;
        },
        existingValues,
      );
    return Object.assign({}, state, { sailPaths: newValues } as SailPathsState);
  }),
  on(putSailPath, (state, action) => {
    const existingValues = Object.assign({}, state.sailPaths);
    existingValues[action.sailPathId] = action.sailPath;
    return Object.assign({}, state, { sailPaths: existingValues } as SailPathsState);
  }),
);

export function sailPathReducer(state: SailPathsState, action: Action) {
  return reducerHandler(state, action);
}
