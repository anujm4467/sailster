import { IClinic } from '../../../../api/src/shared/clinic/clinic.interface';

export interface ClinicsState {
  [propName: string]: IClinic;
}
