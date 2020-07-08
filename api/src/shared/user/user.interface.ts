import { IProfile } from '../profile/profile.interface';

export interface IUser {
  id?: string;
  profileId?: string;
  provider?: string;
  resolvedProfile?: IProfile;
  uid?: string;
}
