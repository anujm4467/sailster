import {
  createAction,
  props,
} from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { ISailChecklist } from '../../../../../api/src/shared/sail-checklist/sail-checklist.interface';

export enum SAIL_CHECKLIST_ACTION_TYPES {
  CREATE = '[Sail Checklist] Create',
  FETCH_ONE = '[Sail Checklist] Fetch One',
  FIND = '[Sail Checklist] Find',
  PUT_ONE = '[Sail Checklist] Put One',
  PUT_MANY = '[Sail Checklist] Put Many',
  RESET = 'Reset',
  UPDATE_ONE = '[Sail Checklist] Update One',
}

export const createSailChecklist = createAction(SAIL_CHECKLIST_ACTION_TYPES.CREATE, props<{ checklist: ISailChecklist }>());
export const fetchSailChecklist = createAction(
  SAIL_CHECKLIST_ACTION_TYPES.FETCH_ONE, props<{ id: string, resolve?: boolean, notify?: boolean }>());
export const findSailChecklists = createAction(SAIL_CHECKLIST_ACTION_TYPES.FIND, props<{query: string}>());
export const putSailChecklist = createAction(SAIL_CHECKLIST_ACTION_TYPES.PUT_ONE, props<{ id: string, checklist: ISailChecklist }>());
export const putSailChecklists = createAction(SAIL_CHECKLIST_ACTION_TYPES.PUT_MANY, props<{ checklists: ISailChecklist[] }>());
export const resetSailChecklists = createAction(SAIL_CHECKLIST_ACTION_TYPES.RESET);
export const updateSailChecklist = createAction(
  SAIL_CHECKLIST_ACTION_TYPES.UPDATE_ONE, props<{ id: string, checklist: ISailChecklist, updateActions?: TypedAction<any>[] }>());
