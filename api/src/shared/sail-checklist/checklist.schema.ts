import { BILGE_STATE } from './bilge-states';
import { FIRE_EXTINGUISHER_STATE } from './fire-extinguisher-states';
import { FLARES_STATE } from './flare-states';
import { FUEL_LEVEL } from './fuel-levels';

// tslint:disable-next-line: variable-name
export const ChecklistSchema = {
  fuel: {
    type: String,
    enum: Object.values(FUEL_LEVEL),
    default: FUEL_LEVEL.DID_NOT_CHECK,
  },
  bilge: {
    type: String,
    enum: Object.values(BILGE_STATE),
    default: BILGE_STATE.DID_NOT_CHECK,
  },
  flares: {
    type: String,
    enum: Object.values(FLARES_STATE),
    default: FLARES_STATE.DID_NOT_CHECK,
  },
  extinguisher: {
    type: String,
    enum: Object.values(FIRE_EXTINGUISHER_STATE),
    default: FIRE_EXTINGUISHER_STATE.DID_NOT_CHECK,
  },
  comments: String,
  signedByCrew: Boolean,
  signedBySkipper: Boolean,
};
