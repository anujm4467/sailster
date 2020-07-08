import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { IUserAccess } from '../shared/user-access/user-access.interface';

@Injectable()
export class UserAccessService extends CrudService<IUserAccess> {
  constructor(@Inject('USER_ACCESS_MODEL') model: Model<IUserAccess>) {
    super(model);
  }
}
