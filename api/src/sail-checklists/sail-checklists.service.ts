import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { ISailChecklist } from '../shared/sail-checklist/sail-checklist.interface';

@Injectable()
export class SailChecklistsService extends CrudService<ISailChecklist> {
  constructor(@Inject('SAIL_CHECKLIST_MODEL') model: Model<ISailChecklist>) {
    super(model);
  }
}
