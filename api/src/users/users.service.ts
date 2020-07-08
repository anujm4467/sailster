import { CrudService } from '../crud/crud.service';
import { IUser } from '../shared/user/user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class UsersService extends CrudService<IUser> {
  constructor(@Inject('USER_MODEL') profileModel: Model<IUser>) {
    super(profileModel);
  }
}
