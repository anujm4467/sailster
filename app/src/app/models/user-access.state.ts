import { IUserAccess } from '../../../../api/src/shared/user-access/user-access.interface';

export interface UserAccessState {
  [propName: string]: IUserAccess;
}
