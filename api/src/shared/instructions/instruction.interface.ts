import { IMedia } from '../media/media.interface';

export enum INSTRUCTION_PROPS {
  TITLE = 'title',
  INSTRUCTION = 'instruction',
  PICTURES = 'pictures',
}
export interface IInstruction {
  [INSTRUCTION_PROPS.TITLE]: string;
  [INSTRUCTION_PROPS.INSTRUCTION]?: string;
  [INSTRUCTION_PROPS.PICTURES]?: IMedia[];
}
