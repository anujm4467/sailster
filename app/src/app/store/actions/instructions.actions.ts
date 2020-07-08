import {
  createAction,
  props,
} from '@ngrx/store';
import { INSTRUCTIONS } from '../../../../../api/src/shared/instructions/instructions';
import { IInstructions } from '../../../../../api/src/shared/instructions/instructions.interface';

export enum INSTRUCTIONS_ACTION_TYPES {
  CREATE_INSTRUCTIONS = '[Instructions] Create',
  FETCH_INSTRUCTIONS_BY_BOAT = '[Instructions] Fetch by Boat',
  FETCH_INSTRUCTIONS_BY_TYPE = '[Instructions] Fetch by Type',
  PUT_INSTRUCTIONS = '[Instructions] Put',
  RESET = 'Reset',
  UPDATE_INSTRUCTIONS = '[Instructions] Update',
}
export const createInstructions = createAction(
  INSTRUCTIONS_ACTION_TYPES.CREATE_INSTRUCTIONS, props<{ instructions: IInstructions, notify?: boolean }>());
export const fetchInstructionByBoat = createAction(INSTRUCTIONS_ACTION_TYPES.FETCH_INSTRUCTIONS_BY_BOAT, props<{ boatId: string }>());
export const fetchInstructionByType = createAction(
  INSTRUCTIONS_ACTION_TYPES.FETCH_INSTRUCTIONS_BY_TYPE, props<{ boatId: string, instructionsType: INSTRUCTIONS }>());
export const putInstructions = createAction(
  INSTRUCTIONS_ACTION_TYPES.PUT_INSTRUCTIONS, props<{ instructions: IInstructions | IInstructions[] }>());
export const resetInstructions = createAction(INSTRUCTIONS_ACTION_TYPES.RESET);
export const updateInstructions = createAction(
  INSTRUCTIONS_ACTION_TYPES.UPDATE_INSTRUCTIONS, props<{ id: string, instructions: IInstructions, notify?: boolean }>());
