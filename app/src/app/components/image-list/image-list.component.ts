import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IMedia } from '../../../../../api/src/shared/media/media.interface';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';
import { IProfileMap } from '../../models/profile-state.interface';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnChanges {

  @Input() allowDelete = false;
  @Input() height = 100;
  @Input() pictures: string[] | IMedia[] = [];
  @Input() profiles: IProfileMap;
  @Input() showAuthor = false;
  @Input() user: User;
  @Input() width = 100;
  @Output() deleteClick: EventEmitter<IMedia | string> = new EventEmitter<IMedia | string>();
  @Output() goToProfile: EventEmitter<string> = new EventEmitter<string>();
  @Output() profileFetcher: EventEmitter<string> = new EventEmitter<string>();

  public picturesArray: IMedia[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pictures && changes.pictures.previousValue !== changes.pictures.currentValue) {
      this.picturesArray = this.constructPicturesArray();
    }
  }

  private constructPicturesArray(): IMedia[] {
    if (!this.pictures || this.pictures.length === 0) {
      return [];
    }

    if (typeof this.pictures[0] === 'string') {
      return (this.pictures as string[])
        .map((picture) => {
          return { url: picture } as IMedia;
        });
    }

    return this.pictures as IMedia[];
  }

  public getAuthor(profileId: string): IProfile {
    const profile = this.profiles[profileId];

    if (profile === undefined) {
      this.profileFetcher.emit(profileId);
    }

    return profile;
  }

  public canDelete(picture: IMedia): boolean {
    if (!this.user) {
      return false;
    }

    return this.user.profile.id === picture.author || this.user.access.deletePictures;
  }
}
