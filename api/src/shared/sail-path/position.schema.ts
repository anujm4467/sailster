import {
  CoordinatesSchema,
  ICoordinatesSchema,
} from './coordinates.schema';
import { POSITION_PROPS } from './position.interface';

export interface IPositionSchema {
  [POSITION_PROPS.COORDS]: ICoordinatesSchema;
  [POSITION_PROPS.TIME_STAMP]: NumberConstructor;
}

export const PositionSchema: IPositionSchema = {
  coords: CoordinatesSchema,
  timestamp: Number,
};
