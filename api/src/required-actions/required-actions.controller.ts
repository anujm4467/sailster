import {
  Controller,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { IRequiredAction } from '../shared/required-action/required-action.interface';
import { RequiredActionsService } from './required-actions.service';

@Controller('required-actions')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class RequiredActionsController extends CrudController<IRequiredAction> {
  constructor(service: RequiredActionsService) {
    super(service);
  }
}
