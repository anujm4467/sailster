import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent {

  @Input() public profiles: IProfile[];
  @Input() public title: string;
  @Input() public emptyMessage = 'There are no profiles.';
  @Output() public refreshAction: EventEmitter<void> = new EventEmitter<void>();
  @Output() public profileClick: EventEmitter<IProfile> = new EventEmitter<IProfile>();

  public captionActions = [
    {
      name: 'refresh',
      icon: 'refresh',
      tooltip: 'refresh',
    },
  ];

  public refresh() {
    this.refreshAction.emit();
  }

  public clickProfile(profile: IProfile): void {
    this.profileClick.emit(profile);
  }

}
