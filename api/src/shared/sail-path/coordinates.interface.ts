export enum COORDINATES_PROPS {
  ACCURACY = 'accuracy',
  ALTITUDE = 'altitude',
  ALTITUDE_ACCURACY = 'altitudeAccuracy',
  HEADING = 'heading',
  LATITUDE = 'latitude',
  LONGITUDE = 'longitude',
  SPEED = 'speed',
}

export interface ICoordinates {
  [COORDINATES_PROPS.ACCURACY]: number;
  [COORDINATES_PROPS.ALTITUDE]: number;
  [COORDINATES_PROPS.ALTITUDE_ACCURACY]: number;
  [COORDINATES_PROPS.HEADING]: number;
  [COORDINATES_PROPS.LATITUDE]: number;
  [COORDINATES_PROPS.LONGITUDE]: number;
  [COORDINATES_PROPS.SPEED]: number;
}
