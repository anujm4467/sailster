import { IInstructions } from '../../../../api/src/shared/instructions/instructions.interface';

export interface InstructionsMap {
  [prop: string]: IInstructions;
}
export interface InstructionsState {
  [prop: string]: InstructionsMap;
}
