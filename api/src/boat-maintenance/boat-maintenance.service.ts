import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { IBoatMaintenance } from '../shared/maintenance/maintenance.interface';

@Injectable()
export class BoatMaintenanceService extends CrudService<IBoatMaintenance> {

  constructor(@Inject('BOAT_MAINTENANCE_MODEL') model: Model<IBoatMaintenance>) {
    super(model);
  }
}
