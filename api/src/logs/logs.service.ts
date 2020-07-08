import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { ILog } from '../shared/log/log.interface';

@Injectable()
export class LogsService extends CrudService<ILog> {
  constructor(@Inject('LOG_MODEL') model: Model<ILog>) {
    super(model);
  }
}
