import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { IPastSailsState } from '../../models/past-sails-state.interface';
import {
  putPastSailsForAll,
  putPastSailsForUser,
  resetPastSails,
} from '../actions/past-sails.actions';

const initialState = {} as IPastSailsState;

const reducerHandler = createReducer(
  initialState,
  on(resetPastSails, () => initialState),
  on(putPastSailsForAll, (state, action) => {
    return Object.assign({}, state, { all: action.sails });
  }),
  on(putPastSailsForUser, (state, action) => {
    return Object.assign({}, state, { [action.id]: action.sails });
  })
);

export function pastSailsReducer(state: IPastSailsState | undefined, action: Action) {
  return reducerHandler(state, action);
}
