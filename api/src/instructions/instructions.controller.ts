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
import { UserAccessGuard } from '../guards/user-access.guard';
import { IInstructions } from '../shared/instructions/instructions.interface';
import { USER_ACCESS_FIELDS } from '../shared/user-access/user-access.interface';
import { InstructionsService } from './instructions.service';

@Controller('instructions')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, UserAccessGuard)
export class InstructionsController extends CrudController<IInstructions> {
  constructor(service: InstructionsService) {
    super(service);
    this.allowedRoutes.create = false;
  }

  @Patch(':id')
  @SetMetadata('acess', [USER_ACCESS_FIELDS.CREATE_BOAT, USER_ACCESS_FIELDS.EDIT_BOAT])
  update(@Req() req, @Param('id') id: string, @Body() document: IInstructions, @Query() query?)
    : Promise<IInstructions> {
    return super.update(req, id, document, query);
  }
}
