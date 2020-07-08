import { COORDINATES_PROPS } from './coordinates.interface';

export interface ICoordinatesSchema {
  [COORDINATES_PROPS.ACCURACY]: NumberConstructor;
  [COORDINATES_PROPS.ALTITUDE]: NumberConstructor;
  [COORDINATES_PROPS.ALTITUDE_ACCURACY]: NumberConstructor;
  [COORDINATES_PROPS.HEADING]: NumberConstructor;
  [COORDINATES_PROPS.LATITUDE]: NumberConstructor;
  [COORDINATES_PROPS.LONGITUDE]: NumberConstructor;
  [COORDINATES_PROPS.SPEED]: NumberConstructor;
}

export const CoordinatesSchema: ICoordinatesSchema  = {
  accuracy: Number,
  altitude: Number,
  altitudeAccuracy: Number,
  heading: Number,
  latitude: Number,
  longitude: Number,
  speed: Number,
};
