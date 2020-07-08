import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { FeedbackRating } from '../../../../../../api/src/shared/feedback/feedback-rating';
import { IFeedback } from '../../../../../../api/src/shared/feedback/feedback.interface';
import { FeedbackState } from '../../../models/feedback.state';
import { fetchFeedback } from '../../../store/actions/feedback.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-feedback-view-page',
  templateUrl: './feedback-view-page.component.html',
  styleUrls: ['./feedback-view-page.component.css']
})
export class FeedbackViewPageComponent extends BasePageComponent implements OnInit {

  public feedbackRatings = FeedbackRating;

  constructor(
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.FEEDBACKS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
  }

  public get title(): string {
    const sail = this.getSail(this.sailId);
    const sailName = sail ? sail.name : 'unknown sail';
    return `Feedback for sail "${sailName}"`;
  }

  public get sailId(): string {
    return this.feedback ? this.feedback.feedbackFor : null;
  }

  public get feedbackId(): string {
    return this.route.snapshot.params.feedbackId;
  }

  public get feedback(): IFeedback {
    const feedbackState: FeedbackState = this.store[STORE_SLICES.FEEDBACKS];
    const allFeedback = feedbackState.feedbacks;

    const feedback = allFeedback[this.feedbackId];

    if (feedback === undefined && !this._fetching[this.feedbackId]) {
      this.dispatchAction(fetchFeedback({ feedbackId: this.feedbackId }));
    }

    return feedback;
  }

  public goToSail(): void {
    this.viewSail(this.sailId);
  }
}
