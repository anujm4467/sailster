import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { IHistory } from '../shared/history/history.interface';

@Injectable()
export class HistoryService extends CrudService<IHistory> {
  constructor(@Inject('HISTORY_MODEL') model: Model<IHistory>) {
    super(model);
  }
}
