import { PROFILE_ROLES } from '../profile/profile-roles.enum';
import { PROFILE_STATUS } from '../profile/profile-status.enum';
import { IUserAccess } from '../user-access/user-access.interface';

export interface JwtObject {
  email: string;
  exp?: number;
  access?: IUserAccess;
  expireAt: number;
  iat?: number;
  profileId: string;
  provider: string;
  roles: PROFILE_ROLES[];
  status: PROFILE_STATUS;
  sub: string;
  userId?: string;
  username: string;
}
