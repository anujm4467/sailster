import * as mongoose from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Query,
  Req,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { IQuery } from '../crud/crud.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserAccessGuard } from '../guards/user-access.guard';
import { ProfileService } from '../profile-service/profile.service';
import { IAchivement } from '../shared/achievement/achievement.interface';
import {
  CLINIC_PROPS,
  IClinic,
} from '../shared/clinic/clinic.interface';
import { PROFILE_PROPS } from '../shared/profile/profile.interface';
import { JwtObject } from '../shared/token/jwt-object.interface';
import { USER_ACCESS_FIELDS } from '../shared/user-access/user-access.interface';
import { ClinicsService } from './clinics.service';

@Controller('clinics')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class ClinicsController extends CrudController<IClinic> {

  constructor(
    service: ClinicsService,
    private profileService: ProfileService,
  ) {
    super(service);
  }

  @Post()
  @SetMetadata('access', [USER_ACCESS_FIELDS.CREATE_CLINIC])
  @UseGuards(UserAccessGuard)
  create(@Req() req, @Body() document: IClinic, @Query() query?: IQuery): Promise<IClinic> {
    return super.create(req, document, query);
  }

  @Patch(':id')
  @SetMetadata('access', [USER_ACCESS_FIELDS.EDIT_CLINIC])
  @UseGuards(UserAccessGuard)
  update(@Req() req, @Param('id') id: string, @Body() document: IClinic, @Query() query?: IQuery): Promise<IClinic> {
    return super.update(req, id, document, query);
  }

  @Patch(':clinicId/graduate-user/:profileId')
  graduateUseFromClinic(@Req() request, @Param('clinicId') clinicId: string, @Param('profileId') profileId: string) {
    const user: JwtObject = request.user;

    return this.service
      .findOne<IClinic>({ _id: clinicId, [CLINIC_PROPS.INSTRUCTOR]: user.profileId })
      .then((clinicWithInstructor) => {
        if (!clinicWithInstructor) {
          throw new UnauthorizedException('You must be an clinic\' instructor to graduate users.');
        }

        return this.service.updateByIdAnything(clinicId, { $pull: { [CLINIC_PROPS.ENROLLED_USERS]: profileId } })
          .then((clinic) => {
            const achievementId = new mongoose.Types.ObjectId().toHexString();
            const achievement: IAchivement = {
              _id: achievementId,
              achievedBy: profileId,
              badge: clinicWithInstructor.badge && clinicWithInstructor.badge[0],
              clinic: clinicId,
              givenBy: user.profileId,
              givenOn: new Date(),
              id: achievementId,
              title: clinic.title,
            };

            return this.profileService
              .updateByIdAnything(profileId, { $push: { [PROFILE_PROPS.ACHIEVEMENTS]: achievement } })
              .then(() => clinic);
          });
      });
  }

  @Patch(':clinicId/enroll/:profileId')
  enrollInClinic(@Req() request, @Param('clinicId') clinicId: string, @Param('profileId') profileId: string) {
    const user: JwtObject = request.user;

    if (user.profileId !== profileId) {
      return Promise.reject(new Error('user does not match profile'));
    }

    return this.service.updateByIdAnything(clinicId, { $addToSet: { [CLINIC_PROPS.ENROLLED_USERS]: profileId } });
  }

  @Patch(':clinicId/add-user/:profileId')
  addUserToClinic(@Req() request, @Param('clinicId') clinicId: string, @Param('profileId') profileId: string) {
    const user: JwtObject = request.user;

    return this.service
      .findOne<IClinic>({ _id: clinicId })
      .then((clinic) => {
        if (!user.access.access.editClinic && clinic.instructor !== user.profileId) {
          throw new UnauthorizedException('You are not authorized to add users to this clinic');
        }

        return this.service.updateByIdAnything(clinicId, { $addToSet: { [CLINIC_PROPS.ENROLLED_USERS]: profileId } });
      });
  }

  @Delete(':clinicId/leave/:profileId')
  leaveClinic(@Req() request, @Param('clinicId') clinicId: string, @Param('profileId') profileId: string) {
    const user: JwtObject = request.user;

    if (user.profileId !== profileId) {
      return Promise.reject(new Error('user does not match profile'));
    }

    return this.service.updateByIdAnything(clinicId, { $pull: { [CLINIC_PROPS.ENROLLED_USERS]: profileId } });
  }

  @Delete(':clinicId/remove-user/:profileId')
  removeUserFromClinic(@Req() request, @Param('clinicId') clinicId: string, @Param('profileId') profileId: string) {
    const user: JwtObject = request.user;

    return this.service
      .findOne<IClinic>({ _id: clinicId })
      .then((clinic) => {
        if (!user.access.access.editClinic && clinic.instructor !== user.profileId) {
          throw new UnauthorizedException('You are not authorized to add users to this clinic');
        }

        return this.service.updateByIdAnything(clinicId, { $pull: { [CLINIC_PROPS.ENROLLED_USERS]: profileId } });
      });
  }

}
