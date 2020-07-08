import * as mongoose from 'mongoose';
import { INSTRUCTIONS } from './instructions';
import { InstructionSchema } from './instruction.schema';
import { DB_MODELS } from '../db-models.enum';
import { INSTRUCTIONS_PROPS } from './instructions.interface';

export const InstructionsVirtuals = [
  {
    name: 'resolvedBoat',
    model: {
      ref: DB_MODELS.BOAT,
      localField: INSTRUCTIONS_PROPS.BOAT_ID,
      foreignField: '_id',
      justOne: true,
    },
  },
];

export const InstructionsSchema = {
  [INSTRUCTIONS_PROPS.BOAT_ID]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.BOAT },
  [INSTRUCTIONS_PROPS.INSTRUCTIONS_TYPE]: {
    type: String,
    enum: Object.values(INSTRUCTIONS),
  },
  [INSTRUCTIONS_PROPS.INSTRUCTIONS]: [InstructionSchema],
};

export const InstructionsSchemaIndex = [
  {
    fields: {
      _id: 1,
      [INSTRUCTIONS_PROPS.BOAT_ID]: 1,
      [INSTRUCTIONS_PROPS.INSTRUCTIONS_TYPE]: 1,
    },
    options: {
      unique: true,
    },
  },
];
