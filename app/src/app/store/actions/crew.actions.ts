import {
  createAction,
  props,
} from '@ngrx/store';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';

export enum CREW_ACTION_TYPES {
  FETCH_MANY = '[Crew] Fetch Many',
  FETCH_ONE = '[Crew] Fetch One',
  PUT_MANY = '[Crew] Put Many',
  PUT_ONE = '[Crew] Put One',
  RESET = 'Reset',
}

export const fetchCrewPerson = createAction(CREW_ACTION_TYPES.FETCH_ONE, props<{ id: string }>());
export const fetchCrew = createAction(CREW_ACTION_TYPES.FETCH_MANY);
export const putCrewPerson = createAction(CREW_ACTION_TYPES.PUT_ONE, props<{ id: string, crew: IProfile }>());
export const putCrew = createAction(CREW_ACTION_TYPES.PUT_MANY, props<{ crew: IProfile[] }>());
export const resetCrew = createAction(CREW_ACTION_TYPES.RESET);
