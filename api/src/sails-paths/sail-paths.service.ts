import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { ISailPath } from '../shared/sail-path/sail-path.interface';

@Injectable()
export class SailPathsService extends CrudService<ISailPath> {
  constructor(@Inject('SAIL_PATH_MODEL') model: Model<ISailPath>) {
    super(model);
  }
}
