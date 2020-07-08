import {
  createAction,
  props,
} from '@ngrx/store';
import { IComment } from '../../../../../api/src/shared/comment/comment.interface';
import { IBoatMaintenance } from '../../../../../api/src/shared/maintenance/maintenance.interface';

export enum BOAT_MAINTENANCE_ACTION_TYPES {
  CREATE = '[Boat Maintenance] Create',
  UPDATE = '[Boat Maintenance] Update',
  FETCH_MANY = '[Boat Maintenance] Fetch Many',
  FETCH_ONE = '[Boat Maintenance] Fetch One',
  PUT_MANY = '[Boat Maintenance] Put Many',
  PUT_ONE = '[Boat Maintenance] Put One',
  POST_COMMENT = '[Boat Maintenance] Post Comment',
  RESET = 'Reset',
}

export const createBoatMaintenance = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.CREATE, props<{ maintenance: IBoatMaintenance, notify?: boolean }>());
export const updateBoatMaintenance = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.UPDATE, props<{ id: string, maintenance: IBoatMaintenance, notify?: boolean }>());
export const fetchBoatMaintenances = createAction(BOAT_MAINTENANCE_ACTION_TYPES.FETCH_MANY, props<{ query: string, notify?: boolean }>());
export const fetchBoatMaintenance = createAction(BOAT_MAINTENANCE_ACTION_TYPES.FETCH_ONE, props<{ id: string, notify?: boolean }>());
export const postBoatMaintenanceComment = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.POST_COMMENT, props<{ id: string, comment: IComment, notify?: boolean }>());
export const putBoatMaintenances = createAction(BOAT_MAINTENANCE_ACTION_TYPES.PUT_MANY, props<{ maintenances: IBoatMaintenance[] }>());
export const putBoatMaintenance = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.PUT_ONE, props<{ id: string, maintenance: IBoatMaintenance }>());
export const resetBoatMaintenances = createAction(BOAT_MAINTENANCE_ACTION_TYPES.RESET);
