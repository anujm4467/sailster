import {
  Action,
  createAction,
  props,
} from '@ngrx/store';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';

export enum PROFILE_ACTION_TYPES {
  FETCH_MANY = '[Profile] Fetch Many',
  FETCH_ONE = '[Profile] Fetch One',
  FETCH_COUNT = '[Profile] Fetch Count',
  PUT_COUNT = '[Profile] Put Count',
  PUT_MANY = '[Profile] Put Many',
  PUT_ONE = '[Profile] Put One',
  RESET = 'Reset',
  UPDATE_ACCESS = '[Profile] Update Access',
  UPDATE_INFO = '[Profile] Update Info',
  SEARCH_BY_NAME_OR_EMAIL = '[Profile] Search by name or email'
}

export const fetchTotalProfileCount = createAction(PROFILE_ACTION_TYPES.FETCH_COUNT);
export const fetchProfile = createAction(PROFILE_ACTION_TYPES.FETCH_ONE, props<{ id: string }>());
export const searchProfilesByNameOrEmail = createAction(
  PROFILE_ACTION_TYPES.SEARCH_BY_NAME_OR_EMAIL, props<{ text: string, notify?: boolean }>());
export const fetchProfiles = createAction(PROFILE_ACTION_TYPES.FETCH_MANY, props<{ query: string, notify?: boolean }>());
export const putTotalProfileCount = createAction(PROFILE_ACTION_TYPES.PUT_COUNT, props<{ count: number }>());
export const putProfile = createAction(PROFILE_ACTION_TYPES.PUT_ONE, props<{ id: string, profile: IProfile }>());
export const putProfiles = createAction(PROFILE_ACTION_TYPES.PUT_MANY, props<{ profiles: IProfile[] }>());
export const resetProfiles = createAction(PROFILE_ACTION_TYPES.RESET);
export const updateProfileAccess = createAction(
  PROFILE_ACTION_TYPES.UPDATE_ACCESS,
  props<{ id: string, profile: IProfile, notify: boolean, completeRequiredAction: Action }>());
export const updateProfileInfo = createAction(
  PROFILE_ACTION_TYPES.UPDATE_INFO,
  props<{ id: string, profile: IProfile, notify?: boolean }>());
