import { INSTRUCTIONS } from './instructions';
import { IBoat } from '../boat/boat.interface';
import { IInstruction } from './instruction.interface';

export enum INSTRUCTIONS_PROPS {
  BOAT_ID = 'boatId',
  CREATED_AT = 'createdAt',
  ID = 'id',
  INSTRUCTIONS = 'instructions',
  INSTRUCTIONS_TYPE = 'instructionsType',
  RESOLVED_BOAT = 'resolvedBoat',
  UPDATED_AT = 'updatedAt',
}

export interface IInstructions {
  [INSTRUCTIONS_PROPS.BOAT_ID]?: string;
  [INSTRUCTIONS_PROPS.CREATED_AT]?: Date;
  [INSTRUCTIONS_PROPS.ID]?: string;
  [INSTRUCTIONS_PROPS.INSTRUCTIONS]?: IInstruction[];
  [INSTRUCTIONS_PROPS.INSTRUCTIONS_TYPE]?: INSTRUCTIONS;
  [INSTRUCTIONS_PROPS.RESOLVED_BOAT]?: IBoat;
  [INSTRUCTIONS_PROPS.UPDATED_AT]?: Date;
}
