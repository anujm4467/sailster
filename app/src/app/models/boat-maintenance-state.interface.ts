import { IBoatMaintenance } from '../../../../api/src/shared/maintenance/maintenance.interface';

export interface IBoatMaintenanceState {
  [propName: string]: IBoatMaintenance;
}

export interface IBoatMaintenanceMap {
  [propName: string]: IBoatMaintenance;
}
