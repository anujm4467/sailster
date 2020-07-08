import {
    createAction,
    props,
} from '@ngrx/store';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';

export enum SKIPPER_ACTION_TYPES {
  FETCH_MANY = '[Skipper] Fetch Many',
  FETCH_ONE = '[Skipper] Fetch One',
  PUT_MANY = '[Skipper] Put Many',
  PUT_ONE = '[Skipper] Put One',
  RESET = 'Reset',
}

export const fetchSkippers = createAction(SKIPPER_ACTION_TYPES.FETCH_MANY);
export const fetchSkipper = createAction(SKIPPER_ACTION_TYPES.FETCH_ONE, props<{ id: string }>());
export const putSkippers = createAction(SKIPPER_ACTION_TYPES.PUT_MANY, props<{ skippers: IProfile[] }>());
export const putSkipper = createAction(SKIPPER_ACTION_TYPES.PUT_ONE, props<{ id: string, skipper: IProfile }>());
export const resetSkippers = createAction(SKIPPER_ACTION_TYPES.RESET);
