import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { PROFILE_STATUS } from '../shared/profile/profile-status.enum';
import { JwtObject } from '../shared/token/jwt-object.interface';

@Injectable()
export class ApprovedUserGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtObject = request.user;

    if (!user) {
      return false;
    }

    const profileStatus = user.status;

    if (request.path.startsWith('/profiles/update-info/')) {
      return profileStatus === PROFILE_STATUS.APPROVED || profileStatus === PROFILE_STATUS.REGISTRATION;
    }

    return profileStatus === PROFILE_STATUS.APPROVED;
  }

}
