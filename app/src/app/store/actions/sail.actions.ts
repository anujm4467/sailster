import {
  createAction,
  props,
} from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { IComment } from '../../../../../api/src/shared/comment/comment.interface';
import { ISail } from '../../../../../api/src/shared/sail/sail.interface';

export enum SAIL_ACTION_TYPES {
  CANCEL = '[Sail] Cancel',
  COMPLETE = '[Sail] Complete',
  CREATE = '[Sail] Create',
  FETCH_MANY = '[Sail] Fetch Many',
  FETCH_ONE = '[Sail] Fetch One',
  JOIN_CREW = '[Sail] Join As Crew',
  JOIN_PASSENGER = '[Sail] Join As Passenger',
  JOIN_SKIPPER = '[Sail] Join As Skipper',
  LEAVE_SAIL = '[Sail] Leave',
  POST_COMMENT = '[Sail] Post Comment',
  PUT_MANY = '[Sail] Put Many',
  PUT_ONE = '[Sail] Put One',
  PUT_SEARCH_RESULTS = '[Sail] Put Search Results',
  RESET = 'Reset',
  SEARCH = '[Sail] Search',
  START = '[Sail] Start',
  UPDATE_ONE = '[Sail] Update One',
}

export const cancelSail = createAction(SAIL_ACTION_TYPES.CANCEL, props<{ id: string, sail: ISail, notify?: boolean }>());
export const postSailComment = createAction(
  SAIL_ACTION_TYPES.POST_COMMENT, props<{ sailId: string, comment: IComment, notify?: boolean }>());
export const completeSail = createAction(SAIL_ACTION_TYPES.COMPLETE, props<{ sail: ISail, notify?: boolean }>());
export const createSail = createAction(SAIL_ACTION_TYPES.CREATE, props<{ sail: ISail }>());
export const startSail = createAction(SAIL_ACTION_TYPES.START, props<{ sail: ISail, notify?: boolean }>());
export const fetchSail = createAction(SAIL_ACTION_TYPES.FETCH_ONE, props<{ id: string, notify?: boolean }>());
export const fetchSails = createAction(SAIL_ACTION_TYPES.FETCH_MANY, props<{ notify?: boolean, query?: string }>());
export const joinSailAsCrew = createAction(SAIL_ACTION_TYPES.JOIN_CREW, props<{ sailId: string, notify?: boolean }>());
export const joinSailAsPassenger = createAction(
  SAIL_ACTION_TYPES.JOIN_PASSENGER, props<{ sailId: string, notify?: boolean }>());
export const joinSailAsSkipper = createAction(
  SAIL_ACTION_TYPES.JOIN_SKIPPER, props<{ sailId: string, notify?: boolean }>());
export const leaveSail = createAction(SAIL_ACTION_TYPES.LEAVE_SAIL, props<{ sailId: string, notify?: boolean }>());
export const putSail = createAction(SAIL_ACTION_TYPES.PUT_ONE, props<{ id: string, sail: ISail }>());
export const putSails = createAction(SAIL_ACTION_TYPES.PUT_MANY, props<{ sails: ISail[] }>());
export const putSailSearchResults = createAction(SAIL_ACTION_TYPES.PUT_SEARCH_RESULTS, props<{ sails: ISail[] }>());
export const searchSails = createAction(SAIL_ACTION_TYPES.SEARCH, props<{ notify?: boolean, query?: string }>());
export const resetSails = createAction(SAIL_ACTION_TYPES.RESET);
export const updateSail = createAction(
  SAIL_ACTION_TYPES.UPDATE_ONE,
  props<{ id: string, sail: ISail, updateActions?: TypedAction<any>[] }>());
