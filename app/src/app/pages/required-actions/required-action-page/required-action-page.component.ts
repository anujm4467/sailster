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
import { IRequiredAction } from '../../../../../../api/src/shared/required-action/required-action.interface';
import { REQUIRED_ACTIONS } from '../../../../../../api/src/shared/required-action/required-action.types';
import { RequiredActionsState } from '../../../models/required-actions.state';
import {
  editProfilePrivilegesRoute,
  submitFeedbackRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-required-action-page',
  templateUrl: './required-action-page.component.html',
  styleUrls: ['./required-action-page.component.css']
})
export class RequiredActionPageComponent extends BasePageComponent implements OnInit {

  public requiredActionId: string;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.requiredActionId = this.route.snapshot.params.id;
    this.subscribeToStoreSliceWithUser(STORE_SLICES.REQUIRED_ACTIONS, (state: RequiredActionsState) => {
      const action = state.actions[this.requiredActionId];

      if (action) {
        switch (action.actionType) {
          case REQUIRED_ACTIONS.REVIEW_NEW_PROFILE:
            this.goTo([`${editProfilePrivilegesRoute(action.data.profileId)}`], { queryParams: { completeRequiredAction: action.id } });
            break;
          case REQUIRED_ACTIONS.RATE_SAIL:
            this.goTo([`${submitFeedbackRoute(action.data.sailId)}`], { queryParams: { completeRequiredAction: action.id } });
            break;
        }
      }
    });
  }

  public get requiredActionsState(): RequiredActionsState {
    return this.store[STORE_SLICES.REQUIRED_ACTIONS] || {};
  }

  public get requiredAction(): IRequiredAction {
    if (!this.requiredActionId) {
      return null;
    }

    return this.requiredActionsState.actions[this.requiredActionId];
  }

}
