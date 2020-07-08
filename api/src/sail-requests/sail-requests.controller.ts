import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ISailRequest, SAIL_REQUEST_PROPS, ISailRequestResolved } from '../shared/sail-request/sail-request.interface';
import { SailRequestsService } from './sail-requests.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { EmailService } from '../email/email.service';
import { IQuery } from '../crud/crud.service';
import { JwtObject } from '../shared/token/jwt-object.interface';

@Controller('sail-requests')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class SailRequestsController extends CrudController<ISailRequest> {
  constructor(
    service: SailRequestsService,
    private emailService: EmailService,
  ) {
    super(service);
  }

  @Post()
  async create(@Req() req, @Body() document: ISailRequest, @Query() query?: IQuery): Promise<ISailRequest> {
    const createdRequest = await super.create(req, document, query);
    const resolvedRequest = await this.service
      .findById<ISailRequestResolved>(createdRequest.id, { populate: [SAIL_REQUEST_PROPS.BY] });

    this.emailService.emailUtils.sendNewSailRequest(resolvedRequest);

    return Promise.resolve(createdRequest);
  }

  @Patch(':id')
  async update(
    @Req() req, @Param('id') id: string, @Body() document: ISailRequest, @Query() query?): Promise<ISailRequest> {
    const user: JwtObject = req.user;
    const updatedRequest = await super.update(req, id, document, query);
    const resolvedRequest = await this.service
      .findById<ISailRequestResolved>(id, { populate: [SAIL_REQUEST_PROPS.BY] });

    this.emailService.emailUtils.sendUpdateSailRequest(resolvedRequest, user);

    return Promise.resolve(updatedRequest);
  }
}
