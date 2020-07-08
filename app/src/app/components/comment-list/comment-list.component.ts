import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import {
  COMMENT_PROPS,
  IComment,
} from '../../../../../api/src/shared/comment/comment.interface';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';
import { IProfileMap } from '../../models/profile-state.interface';
import { MomentService } from '../../services/moment.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent {

  @Input() comments: IComment[];
  @Input() profiles: IProfileMap = {};
  @Output() profileClick: EventEmitter<IProfile> = new EventEmitter<IProfile>();
  @Output() profileFetcher: EventEmitter<string> = new EventEmitter<string>();

  constructor(@Inject(MomentService) private momentService: MomentService) {}

  public clickProfile(profile: IProfile): void {
    this.profileClick.emit(profile);
  }

  public getProfile(profileId: string): IProfile {
    const profile = this.profiles[profileId];

    if (profile === undefined) {
      this.profileFetcher.emit(profileId);
    }

    return profile;
  }

  public generateCommentAriaLabel(index: number, comment: IComment): string {
    const author: IProfile = this.getProfile(comment[COMMENT_PROPS.AUTHOR]) || {};
    const date = this.momentService.humanizeDateWithTime(comment[COMMENT_PROPS.DATE], false);
    const text = comment[COMMENT_PROPS.COMMENT];

    const label = `
      Comment ${index + 1} of ${this.comments.length}.
      Posted by: ${author.name},
      Posted: ${date}.
      Text: ${text}.
    `;

    return label;
  }
}
