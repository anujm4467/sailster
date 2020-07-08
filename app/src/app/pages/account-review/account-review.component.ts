import {
  Component,
  Inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { PROFILE_STATUS } from '../../../../../api/src/shared/profile/profile-status.enum';
import { BasePageComponent } from '../base-page/base-page.component';

@Component({
  selector: 'app-account-review',
  templateUrl: './account-review.component.html',
  styleUrls: ['./account-review.component.css']
})
export class AccountReviewComponent extends BasePageComponent {

  public ProfileStatus = PROFILE_STATUS;

  constructor(
    @Inject(Store) store: Store<any>,
  ) {
    super(store);
  }

}
