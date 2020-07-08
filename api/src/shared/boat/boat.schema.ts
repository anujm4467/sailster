import { BOAT_STATUS } from './boat-status';
import { HullSchema } from './hull.schema';
import { BOAT_PROPS } from './boat.interface';

export const BoatSchema = {
  [BOAT_PROPS.HULL]: HullSchema,
  [BOAT_PROPS.MAX_OCCUPANCY]: {
    type: Number,
    required: true,
    validate: {
      validator: val => val >= 2 && val <= 15,
      message: () => 'maxOccupancy must be betwen 2 and 15!',
    },
  },
  [BOAT_PROPS.MODEL]: String,
  [BOAT_PROPS.NAME]: { type: String, required: true },
  [BOAT_PROPS.PICTURES]: [String],
  [BOAT_PROPS.STATUS]: {
    type: String,
    required: true,
    enum: Object.values(BOAT_STATUS),
    default: BOAT_STATUS.IN_SERVICE,
  },
  [BOAT_PROPS.WIKI]: String,
};

export const BoatSchemaIndex = [
  {
    fields: {
      [BOAT_PROPS.NAME]: 1,
    },
    options: {
      unique: true,
    },
  },
  {
    fields: {
      [BOAT_PROPS.NAME]: 'text',
    },
  },
];
