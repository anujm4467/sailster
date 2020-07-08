import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';
import { SAIL_REQUEST_STATUS } from '../../../../../api/src/shared/sail-request/sail-request-status';
import { ISailRequest } from '../../../../../api/src/shared/sail-request/sail-request.interface';
import { IProfileMap } from '../../models/profile-state.interface';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-sail-request-list',
  templateUrl: './sail-request-list.component.html',
  styleUrls: ['./sail-request-list.component.css']
})
export class SailRequestListComponent {

  @Input() profiles: IProfileMap = {};
  @Input() sailRequests: ISailRequest[] = [];
  @Input() user: User;
  @Output() cancelSailRequest: EventEmitter<string> = new EventEmitter<string>();
  @Output() editSailRequest: EventEmitter<string> = new EventEmitter<string>();
  @Output() profileDialog: EventEmitter<IProfile> = new EventEmitter<IProfile>();
  @Output() profileFetcher: EventEmitter<string> = new EventEmitter<string>();

  public showProfileDialog(profile: IProfile): void {
    this.profileDialog.emit(profile);
  }

  public getProfile(id: string): IProfile {
    const profile = this.profiles[id];

    if (profile === undefined) {
      this.profileFetcher.emit(id);
    }

    return profile;
  }

  public canCancelRequest(request: ISailRequest): boolean {
    return this.canEditRequest(request);
  }

  public canEditRequest(request: ISailRequest): boolean {

    if (this.user.profile.id === request.by && request.status === SAIL_REQUEST_STATUS.NEW) {
      return true;
    }

    return !!this.user.access.editSailRequest;
  }

}
