import { IBoat } from '../../../../api/src/shared/boat/boat.interface';

export interface IBoatState {
  [propName: string]: IBoat;
}

export interface IBoatMap {
  [propName: string]: IBoat;
}
