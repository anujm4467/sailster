import {
  createAction,
  props,
} from '@ngrx/store';
import { ISail } from '../../../../../api/src/shared/sail/sail.interface';

export enum PAST_SAILS_ACTION_TYPES {
  FETCH_ALL = '[Past Sails] Fetch For All',
  FETCH_USER = '[Past Sails] Fetch For User',
  PUT_ALL = '[Past Sails] Put For All',
  PUT_USER = '[Past Sails] Put For User',
  RESET = 'Reset',
}

export const fetchPastSailsForAll = createAction(PAST_SAILS_ACTION_TYPES.FETCH_ALL, props<{ query?: string, notify?: boolean }>());
export const fetchPastSailsForUser = createAction(
  PAST_SAILS_ACTION_TYPES.FETCH_USER,
  props<{ id: string, query?: string, notify?: boolean }>());
export const putPastSailsForAll = createAction(PAST_SAILS_ACTION_TYPES.PUT_ALL, props<{ sails: ISail[] }>());
export const putPastSailsForUser = createAction(PAST_SAILS_ACTION_TYPES.PUT_USER, props<{ id: string, sails: ISail[] }>());
export const resetPastSails = createAction(PAST_SAILS_ACTION_TYPES.RESET);
