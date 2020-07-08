import {
  Component,
  Input,
} from '@angular/core';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';

@Component({
  selector: 'app-profile-bullet',
  templateUrl: './profile-bullet.component.html',
  styleUrls: ['./profile-bullet.component.css']
})
export class ProfileBulletComponent {

  @Input() profile: IProfile;

}
