import { IProfile } from '../../../../api/src/shared/profile/profile.interface';

export interface ProfileDialogData {
  profile: IProfile;
  type: string;
  viewProfile: (id: string) => void;
}
