import { FUEL_LEVEL } from './fuel-levels';
import { BILGE_STATE } from './bilge-states';
import { FLARES_STATE } from './flare-states';
import { FIRE_EXTINGUISHER_STATE } from './fire-extinguisher-states';

export interface IChecklist {
  bilge?: BILGE_STATE;
  comments?: string;
  extinguisher?: FIRE_EXTINGUISHER_STATE;
  flares?: FLARES_STATE;
  fuel?: FUEL_LEVEL;
  signedByCrew?: boolean;
  signedBySkipper?: boolean;
}
