import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';
import { viewProfileRoute } from '../../routes/routes';
import {
  WINDOW_WIDTH,
  WindowService,
} from '../../services/window.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() userProfile: IProfile;
  @Output() logoutListner: EventEmitter<void> = new EventEmitter<void>();
  public WindowWidth = WINDOW_WIDTH;

  constructor(
    @Inject(WindowService) public windowServer: WindowService,
  ) { }

  public logout(): void {
    this.logoutListner.emit();
  }

  public get viewProfileLink(): string {
    return viewProfileRoute(this.userProfile.id);
  }
}
