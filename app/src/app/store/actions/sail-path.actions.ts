import {
  Action,
  createAction,
  props,
} from '@ngrx/store';
import { IPosition } from '../../../../../api/src/shared/sail-path/position.interface';
import { ISailPath } from '../../../../../api/src/shared/sail-path/sail-path.interface';

export enum SAIL_PATH_ACTION_TYPES {
  ADD_SAIL_PATH_POSITIONS = '[Sail Path] Add sail path positions',
  CREATE_SAIL_PATH = '[Sail Path] Create sail path',
  FETCH_SAIL_PATH = '[Sail Path] Fetch sail path',
  FETCH_SAIL_PATHS_FOR_SAIL = '[Sail Path] Fetch sail paths for sail',
  PUT_SAIL_PATH = '[Sail Path] Put sail path',
  PUT_SAIL_PATHS = '[Sail Path] Put sail paths',
  RESET = 'Reset',
  UPDATE_SAIL_PATH = '[Sail Path] Update sail path',
}

export const fetchSailPath = createAction(SAIL_PATH_ACTION_TYPES.FETCH_SAIL_PATH, props<{ sailPathId: string }>());
export const fetchSailPathsForSail = createAction(
  SAIL_PATH_ACTION_TYPES.FETCH_SAIL_PATHS_FOR_SAIL, props<{ sailId: string, notify?: boolean }>());
export const putSailPath = createAction(
  SAIL_PATH_ACTION_TYPES.PUT_SAIL_PATH, props<{ sailPathId: string, sailPath: ISailPath }>());
export const putSailPaths = createAction(SAIL_PATH_ACTION_TYPES.PUT_SAIL_PATHS, props<{ sailPaths: ISailPath[] }>());
export const resetSailPaths = createAction(SAIL_PATH_ACTION_TYPES.RESET);
export const createSailPath = createAction(
  SAIL_PATH_ACTION_TYPES.CREATE_SAIL_PATH,
  props<{
    sailPath: ISailPath,
    notify: boolean,
    goToEdit?: boolean,
    completeRequiredAction?: Action,
  }>());
export const updateSailPath = createAction(
  SAIL_PATH_ACTION_TYPES.UPDATE_SAIL_PATH,
  props<{sailPathId: string, sailPath: ISailPath, notify?: boolean, completeRequiredAction?: Action }>());
export const addSailPathPositions = createAction(
  SAIL_PATH_ACTION_TYPES.ADD_SAIL_PATH_POSITIONS,
  props<{ sailPathId: string, positions: IPosition[], notify?: boolean, completeRequiredAction?: Action }>()
);
