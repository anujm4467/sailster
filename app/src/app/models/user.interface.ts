import { PROFILE_ROLES } from '../../../../api/src/shared/profile/profile-roles.enum';
import { IProfile } from '../../../../api/src/shared/profile/profile.interface';
import { IAccess } from '../../../../api/src/shared/user-access/user-access.interface';

export interface User {
  access: IAccess;
  profile: IProfile;
  roles: PROFILE_ROLES[];
}
