import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { ILoginState } from '../../models/login-state.interface';
import {
  loggedIn,
  loggedOut,
  resetLogin,
  putToken,
} from '../actions/login.actions';
import { decodeJwt } from '../../utils/jwt';

const initialState: ILoginState = {
  token: null,
  tokenData: null,
  user: null,
  when: new Date(),
};

const reducerHandler = createReducer(
  initialState,
  on(resetLogin, () => initialState),
  on(putToken, (state, action) => {
    const tokenData = decodeJwt(action.token);
    return Object.assign({}, state, { tokenData, token: action.token, when: new Date() });
  }),
  on(loggedOut, () => {
    localStorage.clear();
    sessionStorage.clear();
    return initialState;
  }),
  on(loggedIn, (state, action) => {
    return Object.assign({}, state, { user: action.user, when: new Date() });
  }),
);

export function loginReducer(state: ILoginState | undefined, action: Action) {
  return reducerHandler(state, action);
}
