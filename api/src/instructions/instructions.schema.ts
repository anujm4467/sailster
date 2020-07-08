import {
  InstructionsSchema,
  InstructionsSchemaIndex,
} from '../shared/instructions/instructions.schema';
import { schema } from '../utils/schema.util';

export const instructionsSchema = schema(InstructionsSchema, InstructionsSchemaIndex);
