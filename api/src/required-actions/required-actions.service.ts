import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { IRequiredAction } from '../shared/required-action/required-action.interface';

@Injectable()
export class RequiredActionsService extends CrudService<IRequiredAction> {
  constructor(@Inject('REQUIRED_ACTION_MODEL') model: Model<IRequiredAction>) {
    super(model);
  }
}
