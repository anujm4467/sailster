import {
  Body,
  Controller,
  Param,
  Patch,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { IInstructions } from '../shared/instructions/instructions.interface';
import { PROFILE_ROLES } from '../shared/profile/profile-roles.enum';
import { InstructionsService } from './instructions.service';

@Controller('instructions')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class InstructionsController extends CrudController<IInstructions> {
  constructor(service: InstructionsService) {
    super(service);
    this.allowedRoutes.create = false;
  }

  @Patch(':id')
  @SetMetadata('roles', [PROFILE_ROLES.ADMIN, PROFILE_ROLES.FLEET_MANAGER])
  update(@Req() req, @Param('id') id: string, @Body() document: IInstructions, @Query() query?)
    : Promise<IInstructions> {
    return super.update(req, id, document, query);
  }
}
