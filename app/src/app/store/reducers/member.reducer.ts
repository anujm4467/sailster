import {
  createReducer,
  on,
  Action,
} from '@ngrx/store';
import {
  resetMembers,
  putMembers,
} from '../actions/member.actions';
import { IProfileState } from '../../models/profile-state.interface';

const initialState = {} as IProfileState;

const reducerHandler = createReducer(
  initialState,
  on(resetMembers, () => initialState),
  on(putMembers, (state, action) => {
    const map = action
      .members
      .reduce(
        (reducer, member) => {
          reducer[member.id] = member;
          return reducer;
        },
        {},
      );

    return Object.assign({}, state, map);
  })
);

export function memberReducer(state: IProfileState | undefined, action: Action) {
  return reducerHandler(state, action);
}
