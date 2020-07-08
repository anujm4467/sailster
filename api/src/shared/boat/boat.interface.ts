import { BOAT_STATUS } from './boat-status';
import { IHull } from './hull.interface';

export enum BOAT_PROPS {
  HULL = 'hull',
  ID = 'id',
  MAX_OCCUPANCY = 'maxOccupancy',
  MODEL = 'model',
  NAME = 'name',
  PICTURES = 'pictures',
  STATUS = 'status',
  WIKI = 'wiki',
}

export interface IBoat {
  [BOAT_PROPS.HULL]?: IHull;
  [BOAT_PROPS.ID]?: string;
  [BOAT_PROPS.MAX_OCCUPANCY]?: number;
  [BOAT_PROPS.MODEL]?: string;
  [BOAT_PROPS.NAME]?: string;
  [BOAT_PROPS.PICTURES]?: string[];
  [BOAT_PROPS.STATUS]?: BOAT_STATUS;
  [BOAT_PROPS.WIKI]?: string;
}
