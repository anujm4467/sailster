import { IBoat } from '../../../../api/src/shared/boat/boat.interface';

export interface BoatDialogData {
  boat: IBoat;
  type: string;
  viewBoat: (id: string) => void;
}
