import { IProfile } from '../../../../api/src/shared/profile/profile.interface';
import { JwtObject } from '../../../../api/src/shared/token/jwt-object.interface';

export interface ILoginState {
  user: IProfile;
  when: Date;
  token: string;
  tokenData: JwtObject;
}
