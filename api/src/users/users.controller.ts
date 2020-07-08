import { Controller } from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { IUser } from '../shared/user/user.interface';
import { UsersService } from './users.service';

/** this controller is yet. */
@Controller('users')
export class UsersController extends CrudController<IUser> {
  constructor(service: UsersService) {
    super(service);
    this.allowedRoutes = {};
  }
}
