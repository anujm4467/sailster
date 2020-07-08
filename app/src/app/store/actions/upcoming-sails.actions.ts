import {
  createAction,
  props,
} from '@ngrx/store';
import { ISail } from '../../../../../api/src/shared/sail/sail.interface';

export enum UPCOMING_SAILS_ACTION_TYPES {
  FETCH_ALL = '[Upcoming Sails] Fetch For All',
  FETCH_USER = '[Upcoming Sails] Fetch For User',
  PUT_ALL = '[Upcoming Sails] Put For All',
  PUT_USER = '[Upcoming Sails] Put For User',
  RESET = 'Reset',
}

export const fetchUpcomingSailsForAll = createAction(UPCOMING_SAILS_ACTION_TYPES.FETCH_ALL, props<{ query?: string, notify?: boolean }>());
export const fetchUpcomingSailsForUser = createAction(
  UPCOMING_SAILS_ACTION_TYPES.FETCH_USER,
  props<{ id: string, query?: string, notify?: boolean }>());
export const putUpcomingSailsForAll = createAction(UPCOMING_SAILS_ACTION_TYPES.PUT_ALL, props<{ sails: ISail[] }>());
export const putUpcomingSailsForUser = createAction(UPCOMING_SAILS_ACTION_TYPES.PUT_USER, props<{ id: string, sails: ISail[] }>());
export const resetUpcomingSails = createAction(UPCOMING_SAILS_ACTION_TYPES.RESET);
