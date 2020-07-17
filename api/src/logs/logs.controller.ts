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
import { UserAccessGuard } from '../guards/user-access.guard';
import { ILog } from '../shared/log/log.interface';
import { USER_ACCESS_FIELDS } from '../shared/user-access/user-access.interface';
import { LogsService } from './logs.service';

@Controller('logs')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, UserAccessGuard)
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
  @SetMetadata('access', [USER_ACCESS_FIELDS.VIEW_LOGS])
  find<R>(@Query() query: IQuery) {
    return super.find<R>(query);
  }

}
