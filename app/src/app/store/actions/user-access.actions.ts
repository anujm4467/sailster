import {
  createAction,
  props,
} from '@ngrx/store';
import { IUserAccess } from '../../../../../api/src/shared/user-access/user-access.interface';

export enum USER_ACCESS_ACTION_TYPES {
  FETCH_USER_ACCESS = '[User Access] Fetch user access',
  PUT_USER_ACCESS = '[User Access] Put user access',
  RESET = 'Reset',
  UPDATE_USER_ACCESS = '[User Access] Update user access',
}

export const fetchUserAccess = createAction(USER_ACCESS_ACTION_TYPES.FETCH_USER_ACCESS, props<{profileId: string}>());
export const putUserAccess = createAction(USER_ACCESS_ACTION_TYPES.PUT_USER_ACCESS, props<{ profileId: string, access: IUserAccess }>());
export const resetUserAccess = createAction(USER_ACCESS_ACTION_TYPES.RESET);
export const updateUserAccess = createAction(
  USER_ACCESS_ACTION_TYPES.UPDATE_USER_ACCESS, props<{ profileId: string, access: IUserAccess, notify?: boolean }>());
