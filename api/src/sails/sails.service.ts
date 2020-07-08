import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { ISail } from '../shared/sail/sail.interface';

@Injectable()
export class SailsService extends CrudService<ISail> {
  constructor(@Inject('SAIL_MODEL') model: Model<ISail>) {
    super(model);
  }
}
