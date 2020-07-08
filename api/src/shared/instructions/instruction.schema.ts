import { INSTRUCTION_PROPS } from './instruction.interface';
import { MediaSchema, IMediaSchema } from '../media/media.schema';

export interface IInstructionSchema {
  [INSTRUCTION_PROPS.INSTRUCTION]: StringConstructor;
  [INSTRUCTION_PROPS.PICTURES]: IMediaSchema[];
  [INSTRUCTION_PROPS.TITLE]: StringConstructor;
}
export const InstructionSchema: IInstructionSchema = {
  [INSTRUCTION_PROPS.INSTRUCTION]: String,
  [INSTRUCTION_PROPS.PICTURES]: [MediaSchema],
  [INSTRUCTION_PROPS.TITLE]: String,
};
