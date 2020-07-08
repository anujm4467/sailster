import {
  createAction,
  props,
} from '@ngrx/store';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';

export enum LOGIN_ACTION_TYPES {
  AUTHENTICATE_WITH_GOOGLE = '[Login] Authenticate with google',
  LOGGED_IN = '[Login] Logged in',
  LOGGED_OUT = '[Login] Logged out',
  LOG_IN = '[Login] Log in',
  LOG_OUT = '[Login] Log out',
  PUT_TOKEN = '[Login] PUt token',
  RESET = 'Reset',
}

export const authenticateWithGoogle = createAction(LOGIN_ACTION_TYPES.AUTHENTICATE_WITH_GOOGLE);
export const logIn = createAction(LOGIN_ACTION_TYPES.LOG_IN, props<{ token: string }>());
export const logOut = createAction(LOGIN_ACTION_TYPES.LOG_OUT, props<{ message?: string }>());
export const loggedIn = createAction(LOGIN_ACTION_TYPES.LOGGED_IN, props<{ token: string, user: IProfile }>());
export const loggedOut = createAction(LOGIN_ACTION_TYPES.LOGGED_OUT);
export const putToken = createAction(LOGIN_ACTION_TYPES.PUT_TOKEN, props<{ token: string }>());
export const resetLogin = createAction(LOGIN_ACTION_TYPES.RESET);
