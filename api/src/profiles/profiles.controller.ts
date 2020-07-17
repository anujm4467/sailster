import { Request } from 'express';
import * as flatten from 'flatten-obj';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  Req,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CrudController } from '../crud/crud.controller';
import { IQuery } from '../crud/crud.service';
import { EmailService } from '../email/email.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserAccessGuard } from '../guards/user-access.guard';
import { ProfileService } from '../profile-service/profile.service';
import { RequiredActionsService } from '../required-actions/required-actions.service';
import { PROFILE_ROLES } from '../shared/profile/profile-roles.enum';
import { PROFILE_STATUS } from '../shared/profile/profile-status.enum';
import {
  IProfile,
  PROFILE_PROPS,
} from '../shared/profile/profile.interface';
import { IRequiredAction } from '../shared/required-action/required-action.interface';
import { REQUIRED_ACTION_STATE } from '../shared/required-action/required-action.state';
import { REQUIRED_ACTIONS } from '../shared/required-action/required-action.types';
import { JwtObject } from '../shared/token/jwt-object.interface';
import { USER_ACCESS_FIELDS } from '../shared/user-access/user-access.interface';

@Controller('profiles')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class ProfilesController extends CrudController<IProfile> {
  constructor(
    @Inject(EmailService) private emailService: EmailService,
    @Inject(AuthService) private authService: AuthService,
    @Inject(RequiredActionsService) private requiredActionsService: RequiredActionsService,
    service: ProfileService,
  ) {
    super(service);
    this.allowedRoutes.create = false;
    this.allowedRoutes.update = false;
    this.allowedRoutes.delete = false;
  }

  @Get('count')
  @SetMetadata('roles', [PROFILE_ROLES.ADMIN, PROFILE_ROLES.COORDINATOR])
  count(@Query() query: IQuery = {}): Promise<number> {
    return this.service.count(query);
  }

  @Patch('update-info/:id')
  updateInfo(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() document: IProfile,
    @Query() query?,
  ): Promise<IProfile> {

    /* clear all non-user-defined info */
    delete document[PROFILE_PROPS.STATUS];
    delete document[PROFILE_PROPS.ROLES];
    /* ----------- */

    const user: JwtObject = req.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.userId !== id) {
      throw new UnauthorizedException();
    }

    if (user.status === PROFILE_STATUS.REGISTRATION) {
      document.status = PROFILE_STATUS.PENDING_APPROVAL;
      this.emailService.emailUtils.sendNewProfileEmail(document.name);

      const requiredAction: IRequiredAction = {
        actionType: REQUIRED_ACTIONS.REVIEW_NEW_PROFILE,
        assignedBy: user.profileId,
        assignedOn: new Date(),
        data: {
          profileId: user.userId,
        },
        state: REQUIRED_ACTION_STATE.NEW,
        description: `Review new profile for ${document.name || user.username}`,
      };

      this.service
        .find<IProfile>({ [PROFILE_PROPS.ROLES]: PROFILE_ROLES.ADMIN, [PROFILE_PROPS.STATUS]: PROFILE_STATUS.APPROVED })
        .then((admins) => {
          admins.forEach((admin) => {
            requiredAction.assignedTo = admin.id;
            this.requiredActionsService
              .create(requiredAction)
              .catch(error => this.logError(error));
          });
        })
        .catch(error => this.logError(error));
    }

    const asis = (/^true$/i).test(query.asis);
    const flat = asis ? document : flatten()(document);

    return this.service.updateById(id, flat);
  }

  @Patch('update-access/:id')
  @SetMetadata('access', [USER_ACCESS_FIELDS.EDIT_USER_ACCESS])
  @UseGuards(UserAccessGuard)
  updateAccess(
    @Param('id') id: string,
    @Body() document: IProfile,
    @Query() query?,
  ): Promise<IProfile> {

    /* clear all user-defined info */
    Object
      .keys(document)
      .filter(key => key !== PROFILE_PROPS.STATUS && key !== PROFILE_PROPS.ROLES)
      .forEach(key => delete document[key]);
    /* ----------- */

    const asis = (/^true$/i).test(query.asis);
    const flat = asis ? document : flatten()(document);

    return this.service
      .updateById(id, flat)
      .then((profile) => {
        if (document.status === PROFILE_STATUS.APPROVED) {
          this.emailService.emailUtils.sendProfileApprovedEmail(profile.email);
        }
        return profile;
      })
      .then((profile) => {
        this.authService.logout(profile.id);

        return profile;
      });
  }

}
