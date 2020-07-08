import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { IUpcomingSailsState } from '../../models/upcoming-sails-state.interface';
import {
  putUpcomingSailsForAll,
  putUpcomingSailsForUser,
  resetUpcomingSails,
} from '../actions/upcoming-sails.actions';

const initialState = {} as IUpcomingSailsState;

const reducerHandler = createReducer(
  initialState,
  on(resetUpcomingSails, () => initialState),
  on(putUpcomingSailsForAll, (state, action) => {
    return Object.assign({}, state, { all: action.sails });
  }),
  on(putUpcomingSailsForUser, (state, action) => {
    return Object.assign({}, state, { [action.id]: action.sails });
  })
);

export function upcomingSailsReducer(state: IUpcomingSailsState | undefined, action: Action) {
  return reducerHandler(state, action);
}
