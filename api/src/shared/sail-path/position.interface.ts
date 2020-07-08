import { ICoordinates } from './coordinates.interface';

export enum POSITION_PROPS {
  COORDS = 'coords',
  TIME_STAMP = 'timestamp',
}

export interface IPosition {
  [POSITION_PROPS.COORDS]: ICoordinates;
  [POSITION_PROPS.TIME_STAMP]: number;
}
