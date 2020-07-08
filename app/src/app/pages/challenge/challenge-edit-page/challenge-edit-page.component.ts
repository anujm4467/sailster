import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import {
  CHALLENGE_PROPS,
  CHALLENGE_STATUS,
  IChallenge,
} from '../../../../../../api/src/shared/challenge/challenge.interface';
import { MomentService } from '../../../services/moment.service';
import {
  createChallenge,
  updateChallenge,
} from '../../../store/actions/challenge.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-challenge-edit-page',
  templateUrl: './challenge-edit-page.component.html',
  styleUrls: ['./challenge-edit-page.component.css']
})
export class ChallengeEditPageComponent extends BasePageComponent implements OnInit {

  public challengeId: string;
  public form: FormGroup;
  public ChallengeProps = CHALLENGE_PROPS;
  public ChallengeStatus = CHALLENGE_STATUS;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(MomentService) private momentService: MomentService,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.challengeId = this.route.snapshot.params.challengeId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHALLENGES, () => {
      const challenge = this.store[STORE_SLICES.CHALLENGES][this.challengeId];

      if (challenge) {
        this.updateForm(challenge);
      }
    });
  }

  public get title(): string {
    if (this.challengeId) {
      return 'Update Challenge Form';
    }

    return 'New Challenge Form';
  }

  private updateForm(challenge: IChallenge): void {
    this.form.patchValue(challenge);
    this.form.controls[CHALLENGE_PROPS.DUE_DATE].setValue(this.momentService.yyyymmdd(challenge.dueDate));
    this.form.controls[CHALLENGE_PROPS.STATUS].enable();

    this.form.updateValueAndValidity();
    this.form.markAsPristine();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      [CHALLENGE_PROPS.DESCRIPTION]: this.fb.control(undefined, Validators.required),
      [CHALLENGE_PROPS.DUE_DATE]: this.fb.control(undefined, Validators.required),
      [CHALLENGE_PROPS.STATUS]: this.fb.control({ value: CHALLENGE_STATUS.ACTIVE, disabled: true }, Validators.required),
      [CHALLENGE_PROPS.TITLE]: this.fb.control(undefined, Validators.required),
    });
  }

  public get shouldEnableCreateButton(): boolean {
    return this.form && this.form.valid && this.form.dirty && !this.challengeId;
  }

  public get shouldEnableUpdateButton(): boolean {
    return this.form && this.form.valid && this.form.dirty && !!this.challengeId;
  }

  public createChallenge(): void {
    const challenge: IChallenge = this.form.value;

    this.dispatchAction(createChallenge({ challenge }));
  }

  public updateChallenge(): void {
    const challenge: IChallenge = Object
      .keys(this.form.controls)
      .filter(key => this.form.controls[key].dirty)
      .reduce(
        (red, key) => {
          red[key] = this.form.controls[key].value;
          return red;
        },
        {},
      );

    if (challenge.dueDate) {
      const time = challenge.dueDate.toString().split('-');
      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      date.setFullYear(+time[0], +time[1] - 1, +time[2]);
      challenge.dueDate = date;
    }

    this.dispatchAction(updateChallenge({ challenge, challengeId: this.challengeId, notify: true }));

  }

}
