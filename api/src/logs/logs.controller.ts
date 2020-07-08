import {
  Controller,
  Get,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { IQuery } from '../crud/crud.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ILog } from '../shared/log/log.interface';
import { PROFILE_ROLES } from '../shared/profile/profile-roles.enum';
import { LogsService } from './logs.service';

@Controller('logs')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class LogsController extends CrudController<ILog> {
  constructor(
    service: LogsService,
  ) {
    super(service);
    this.allowedRoutes = {
      find: true,
      count: true,
    };
  }

  @Get()
  @SetMetadata('roles', [PROFILE_ROLES.ADMIN])
  find<R>(@Query() query: IQuery) {
    return super.find<R>(query);
  }

}
