import { IProfile } from '../../../../api/src/shared/profile/profile.interface';

export interface IProfileState {
  profiles: IProfileMap;
  totalCount: number;
}

export interface IProfileMap {
  [propName: string]: IProfile;
}
