import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { DB_MODELS } from '../../../../../../api/src/shared/db-models.enum';
import { FeedbackRating } from '../../../../../../api/src/shared/feedback/feedback-rating';
import {
  FEEDBACK_PROPS,
  IFeedback,
} from '../../../../../../api/src/shared/feedback/feedback.interface';
import { ISail } from '../../../../../../api/src/shared/sail/sail.interface';
import { submitFeedback } from '../../../store/actions/feedback.actions';
import { completeRequiredAction } from '../../../store/actions/required-actions.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-feedback-submit-page',
  templateUrl: './feedback-submit-page.component.html',
  styleUrls: ['./feedback-submit-page.component.css']
})
export class FeedbackSubmitPageComponent extends BasePageComponent implements OnInit {

  public submitFeedbackForm: FormGroup;
  public feedbackRatings = FeedbackRating;
  public feedbackRatingKeys = Object.keys(FeedbackRating).filter(key => isNaN(Number(key)));
  public feedbackRatingValues = Object.values(FeedbackRating);

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
  }

  private buildForm(): void {
    this.submitFeedbackForm = this.fb.group({
      [FEEDBACK_PROPS.RATING]: this.fb.control(FeedbackRating.Worst),
      [FEEDBACK_PROPS.FEEDBACK]: this.fb.control(undefined),
    });
  }

  public goToSail(): void {
    this.viewSail(this.sailId);
  }

  public setRating(rating: number): void {
    this.submitFeedbackForm.controls[FEEDBACK_PROPS.RATING].patchValue(rating);
    this.submitFeedbackForm.controls[FEEDBACK_PROPS.RATING].markAsDirty();
  }

  public get title(): string {
    return `Feedback Form For Sail: ${(this.sail || {}).name}`;
  }

  public get sailId(): string {
    return this.route.snapshot.params.sailId;
  }

  public get sail(): ISail {
    return this.getSail(this.sailId);
  }

  public get shouldEnableSubmitButton(): boolean {
    return this.submitFeedbackForm && this.submitFeedbackForm.valid && this.submitFeedbackForm.dirty;
  }

  public get currentRating(): number {
    return this.submitFeedbackForm.controls[FEEDBACK_PROPS.RATING].value;
  }

  public submitForm(): void {
    const feedback: IFeedback = this.submitFeedbackForm.getRawValue();

    feedback.feedbackFor = this.sailId;
    feedback.forType = DB_MODELS.SAIL;
    feedback.date = new Date();

    const completeRequiredActionId = this.route.snapshot.queryParams.completeRequiredAction;

    if (completeRequiredActionId) {
      this.dispatchAction(
        submitFeedback({ feedback, notify: true, completeRequiredAction: completeRequiredAction({ actionId: completeRequiredActionId }) }));
    } else {
      this.dispatchAction(
        submitFeedback({ feedback, notify: true, completeRequiredAction: null }));
    }
  }

}
