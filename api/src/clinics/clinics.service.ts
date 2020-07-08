import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { IClinic } from '../shared/clinic/clinic.interface';

@Injectable()
export class ClinicsService extends CrudService<IClinic> {
  constructor(@Inject('CLINIC_MODEL') model: Model<IClinic>) {
    super(model);
  }
}
