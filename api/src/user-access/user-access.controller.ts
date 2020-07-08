import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { UserAccessGuard } from '../guards/user-access.guard';
import {
  IUserAccess,
  USER_ACCESS_FIELDS,
} from '../shared/user-access/user-access.interface';
import { UserAccessService } from '../user-access-service/user-access.service';

@Controller('user-access')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class UserAccessController extends CrudController<IUserAccess> {

  constructor(
    service: UserAccessService,
  ) {
    super(service);

    this.allowedRoutes = {};
  }

  @Get(':profileId')
  @SetMetadata('access', [USER_ACCESS_FIELDS.EDIT_USER_ACCESS])
  @UseGuards(UserAccessGuard)
  getUserAccess(@Param('profileId') profileId: string): Promise<IUserAccess> {
    return this.service.findById(profileId);
  }

  @Patch(':profileId')
  @UseGuards(UserAccessGuard)
  @SetMetadata('access', [USER_ACCESS_FIELDS.EDIT_USER_ACCESS])
  updateUserAccess(@Param('profileId') profileId: string, @Body() access: IUserAccess): Promise<IUserAccess> {
    return this.service.updateById(profileId, access, {}, { upsert: true, new: true });
  }

}
