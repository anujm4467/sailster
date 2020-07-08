import {
  createAction,
  props,
} from '@ngrx/store';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';

export enum MEMBER_ACTION_TYPES {
  FETCH_MANY = '[Member] Fetch Many',
  FETCH_ONE = '[Member] Fetch One',
  FETCH_BATCH = '[Member] Fetch BATCH',
  PUT_MANY = '[Member] Put Many',
  PUT_ONE = '[Member] Put One',
  RESET = 'Reset',
}

export const fetchMembers = createAction(MEMBER_ACTION_TYPES.FETCH_MANY);
export const fetchMembersBatch = createAction(MEMBER_ACTION_TYPES.FETCH_BATCH, props<{ ids: string[] }>());
export const putMembers = createAction(MEMBER_ACTION_TYPES.PUT_MANY, props<{ members: IProfile[] }>());
export const resetMembers = createAction(MEMBER_ACTION_TYPES.RESET);
