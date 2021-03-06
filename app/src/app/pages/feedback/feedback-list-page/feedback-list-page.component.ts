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
import { ISail } from '../../../../../../api/src/shared/sail/sail.interface';
import { FeedbackState } from '../../../models/feedback.state';
import { viewFeedbackRoute } from '../../../routes/routes';
import { fetchFeedbacksForSail } from '../../../store/actions/feedback.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-feedback-list-page',
  templateUrl: './feedback-list-page.component.html',
  styleUrls: ['./feedback-list-page.component.css']
})
export class FeedbackListPageComponent extends BasePageComponent implements OnInit {

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
    this.dispatchAction(fetchFeedbacksForSail({ sailId: this.sailId }));
  }

  public get sailId(): string {
    return this.route.snapshot.params.sailId;
  }

  public viewFeedback(id: string): void {
    this.goTo([viewFeedbackRoute(id)]);
  }

  public goToSail(): void {
    this.viewSail(this.sailId);
  }

  public get sail(): ISail {
    return this.getSail(this.sailId);
  }

  public get title(): string {
    return `All feedback for sail "${(this.sail || {}).name || ''}"`;
  }

  public get feedbacks(): IFeedback[] {
    const feedbackState: FeedbackState = this.store[STORE_SLICES.FEEDBACKS];
    const allFeedback = feedbackState.feedbacks;

    return Object.values(allFeedback).filter(feedback => feedback.feedbackFor === this.sailId);
  }

  public feedbackAriaLabel(feedback: IFeedback, index: number) {
    const feedbackText = feedback.feedback || 'not provided';
    const rating = this.feedbackRatings[feedback.rating];

    return `feedback ${index + 1} of ${this.feedbacks.length}. feedback: ${feedbackText}. rating: ${rating}`;
  }

  public get averageRating(): string {
    const average = Math.floor(this.feedbacks.reduce((red, feedback) => red + (+feedback.rating), 0) / this.feedbacks.length);

    return this.feedbackRatings[average];
  }
}
