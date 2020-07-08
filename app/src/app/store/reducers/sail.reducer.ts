import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { ISailState } from '../../models/sail-state.interface';
import {
  putSail,
  putSails,
  resetSails,
  putSailSearchResults,
} from '../actions/sail.actions';

const initialState = {} as ISailState;

const reducerHandler = createReducer(
  initialState,
  on(resetSails, () => initialState),
  on(putSail, (state, action) => {
    const newAll = Object.assign({}, state.all, { [action.id]: action.sail });
    return Object.assign({}, state, { all: newAll } as ISailState);
  }),
  on(putSails, (state, action) => {
    const map = action
      .sails
      .reduce(
        (reducer, sail) => {
          reducer[sail.id] = sail;
          return reducer;
        },
        {},
      );
    const newAll = Object.assign({}, state.all, map);
    return Object.assign({}, state, { all: newAll } as ISailState);
  }),
  on(putSailSearchResults, (state, action) => {
    const map = action
      .sails
      .reduce(
        (reducer, sail) => {
          reducer[sail.id] = sail;
          return reducer;
        },
        {},
      );
    const newAll = Object.assign({}, state.all, map);
    return Object.assign({}, state, { all: newAll, search: action.sails } as ISailState);
  })
);

export function sailReducer(state: ISailState | undefined, action: Action) {
  return reducerHandler(state, action);
}
