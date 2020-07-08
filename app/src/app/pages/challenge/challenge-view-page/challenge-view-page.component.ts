import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import {
  IChallenge,
  IChallenger,
} from '../../../../../../api/src/shared/challenge/challenge.interface';
import { IComment } from '../../../../../../api/src/shared/comment/comment.interface';
import { IMedia } from '../../../../../../api/src/shared/media/media.interface';
import { ICDNState } from '../../../models/cdn-state.interface';
import { editChallengeRoute } from '../../../routes/routes';
import {
  CDN_ACTION_STATE,
  deleteFile,
  uploadChallengePicture,
} from '../../../store/actions/cdn.actions';
import {
  completeUserChallenge,
  deleteChallengePicture,
  fetchChallenge,
  postChallengeComment,
  postChallengePictures,
} from '../../../store/actions/challenge.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-challenge-view-page',
  templateUrl: './challenge-view-page.component.html',
  styleUrls: ['./challenge-view-page.component.css']
})
export class ChallengeViewPageComponent extends BasePageComponent implements OnInit {

  public challengeId: string;
  public challenge: IChallenge;
  public picturesForm: FormGroup;
  public fileToDelete: string;
  public fileToUpload: File;
  public pictures: IMedia[];
  public allowDelete = false;
  public challengePictureInput = 'challenge_picture_input';
  public uploadProgress = 0;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router, dialog);
    this.buildForm();
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.challengeId = this.route.snapshot.params.challengeId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHALLENGES, () => {
      this.challenge = this.store[STORE_SLICES.CHALLENGES][this.challengeId];
      (this.picturesForm.get('pictures') as FormArray).clear();
      this.picturesForm.reset();
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CDN, (cdn: ICDNState) => {
      if (this.fileToUpload) {
        const fileName = this.fileToUpload.name;
        if (cdn[fileName].state === CDN_ACTION_STATE.ERROR) {
          this.fileToUpload = null;

          const fileInput = document.getElementById(this.challengePictureInput) as HTMLInputElement;

          if (fileInput) {
            fileInput.value = null;
          }

          this.fileToUpload = null;
        }

        if (cdn[fileName].state === CDN_ACTION_STATE.UPLOADING) {
          this.uploadProgress = cdn[fileName].progress;
        }

        if (cdn[fileName].state === CDN_ACTION_STATE.UPLOADED) {
          const picturesForm = this.picturesForm.get('pictures') as FormArray;

          picturesForm
            .push(this.fb.group({
              url: this.fb.control(cdn[fileName].url),
              comment: this.fb.control(undefined),
            }));

          picturesForm.updateValueAndValidity();
          picturesForm.markAsDirty();
          this.picturesForm.updateValueAndValidity();

          const fileInput = document.getElementById(this.challengePictureInput) as HTMLInputElement;

          if (fileInput) {
            fileInput.value = null;
          }

          this.fileToUpload = null;
          this.uploadProgress = 0;
        }
      }

      if (this.fileToDelete) {
        if (cdn[this.fileToDelete].state === CDN_ACTION_STATE.DELETED) {
          const picturesForm = this.picturesForm.get('pictures') as FormArray;

          const index = picturesForm.controls.findIndex(control => control.get('url').value === this.fileToDelete);

          picturesForm.removeAt(index);

          this.picturesForm.updateValueAndValidity();

          if (picturesForm.length === 0) {
            this.picturesForm.markAsPristine();
          }

          this.fileToDelete = null;
        }

        if (cdn[this.fileToDelete].state === CDN_ACTION_STATE.ERROR) {
          this.fileToDelete = null;
        }
      }

    });

    this.dispatchAction(fetchChallenge({ challengeId: this.challengeId }));
  }

  private buildForm(): void {
    this.picturesForm = this.fb.group({
      pictures: this.fb.array([
      ])
    });
  }

  public deleteCDNFile(formArrayIndex: number): void {
    this.fileToDelete = this.picturesForm.value.pictures[formArrayIndex].url;
    this.dispatchAction(deleteFile({ filePath: this.fileToDelete, notify: true }));
  }

  public uploadNewPicture(pictures: File[]): void {
    this.fileToUpload = pictures[0];
    this.dispatchAction(uploadChallengePicture({ file: pictures[0], challengeId: this.challengeId, notify: true }));
  }

  public editChallenge(): void {
    this.goTo([editChallengeRoute(this.challengeId)]);
  }

  public deletePicture(picture: IMedia): void {
    this.dispatchAction(deleteFile({ filePath: picture.url, notify: true }));
    this.dispatchAction(deleteChallengePicture({ challengeId: this.challengeId, pictureId: picture._id }));
  }

  public get shouldAllowSaveButton(): boolean {
    return this.picturesForm && this.picturesForm.dirty;
  }

  public save(): void {
    const pictures: IMedia[] = this.picturesForm.value.pictures;

    pictures.forEach(picture => picture.author = this.user.profile.id);

    this.dispatchAction(postChallengePictures({ pictures, challengeId: this.challengeId, notify: true }));
  }

  public postNewComment(comment: IComment): void {
    this.dispatchAction(postChallengeComment({ comment, challengeId: this.challengeId, notify: true }));
  }

  public challengeAccomplished(): void {
    const challenger: IChallenger = { profile: this.user.profile.id, completedOn: new Date() };
    this.dispatchAction(completeUserChallenge({ challenger, challengeId: this.challengeId }));
  }

  public get userAccompliedChallenge(): boolean {
    if (!this.challenge) {
      return false;
    }

    return this.challenge.completedBy && this.challenge.completedBy.some(challenger => challenger.profile === this.user.profile.id);
  }

  public get canEditNewChallenge() {
    return !!this.user.access.editChallenge;
  }

  public get canViewAccomplishedBy() {
    return !!this.user.access.viewChallengeAccomplishments;
  }
}
