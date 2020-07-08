import * as _ from 'lodash';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { IQuery } from '../crud/crud.service';
import { EmailService } from '../email/email.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { IComment } from '../shared/comment/comment.interface';
import {
  IBoatMaintenance,
  IBoatMaintenanceResolveProfiles,
} from '../shared/maintenance/maintenance.interface';
import { JwtObject } from '../shared/token/jwt-object.interface';
import { BoatMaintenanceService } from './boat-maintenance.service';

@Controller('boat-maintenance')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class BoatMaintenanceController extends CrudController<IBoatMaintenance> {
  constructor(
    service: BoatMaintenanceService,
    private emailService: EmailService,
  ) {
    super(service);
  }

  @Post()
  create(@Req() _req, @Body() document: IBoatMaintenance, query?: IQuery): Promise<IBoatMaintenance> {
    return super
      .create(_req, document, query)
      .then((newRequest) => {
        this.service
          .findById<IBoatMaintenanceResolveProfiles>(newRequest.id, { populate: ['boat', 'requestedBy'] })
          .then(report => this.emailService.emailUtils.sendNewMaintenanceRequest(report));
        return newRequest;
      });
  }

  @Patch(':id')
  update(
    @Req() _req,
    @Param('id') id: string, @Body() document: IBoatMaintenance, @Query() query?): Promise<IBoatMaintenance> {
    const user: JwtObject = _req.user;

    return super
      .update(_req, id, document, query)
      .then((updatedRequest) => {
        this.service
          .findById<IBoatMaintenanceResolveProfiles>(id, { populate: ['requestedBy', 'servicedBy', 'boat'] })
          .then(report => this.emailService
            .emailUtils
            .sendUpdatedMaintenanceRequest(user.username, document, report));
        return updatedRequest;
      });
  }

  @Post(':id/comment')
  postComment(@Req() req, @Param('id') id: string, @Body() comment: IComment): Promise<IBoatMaintenance> {
    const user: JwtObject = req.user;

    if (comment.author !== user.userId) {
      return Promise.reject(new Error('comment\'s author does not match user'));
    }

    return this.service
      .updateByIdAnything(
        id,
        { $push: { comments: comment } },
      )
      .then((updatedMaintenance) => {
        this.service
          .findById<IBoatMaintenanceResolveProfiles>(id, { populate: ['comments.author', 'requestedBy', 'servicedBy'] })
          .then((report) => {
            this.emailService.emailUtils.sendMaintenanceNewComment(report, comment, user);
          });
        return updatedMaintenance;
      });
  }
}
