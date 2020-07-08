import {
  Controller,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { HistoryService } from '../history/history.service';
import { IHistory } from '../shared/history/history.interface';

@Controller('history')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class HistoryController extends CrudController<IHistory> {
  constructor(
    service: HistoryService,
  ) {
    super(service);
    this.allowedRoutes = { find: true, findOne: true };
  }

}
