import { Request } from 'express';
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
import { HistoryService } from '../history/history.service';
import { PROFILE_ROLES } from '../shared/profile/profile-roles.enum';
import { ISailChecklist } from '../shared/sail-checklist/sail-checklist.interface';
import { SailChecklistsService } from './sail-checklists.service';

@Controller('checklists')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class SailChecklistsController extends CrudController<ISailChecklist> {

  constructor(
    private historyService: HistoryService,
    service: SailChecklistsService) {
    super(service);
    this.allowedRoutes.create = false;
    this.allowedRoutes.delete = false;
  }

  @Patch(':id')
  @SetMetadata('roles', [PROFILE_ROLES.ADMIN, PROFILE_ROLES.COORDINATOR, PROFILE_ROLES.SKIPPER, PROFILE_ROLES.CREW])
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() document: ISailChecklist,
    @Query() query?,
  ): Promise<ISailChecklist> {
    const user = req.user;
    const userId = user.userId;
    const username = user.username;

    return super
      .update(req, id, document, query)
      .then((checklist) => {

        this.historyService
          .create({
            byId: userId,
            byName: username,
            data: JSON.stringify(document),
            event: 'updated checklist',
            forId: checklist.sail,
            forName: 'sail',
          })
          .catch(error => this.logError(error));

        return checklist;
      });
  }
}
