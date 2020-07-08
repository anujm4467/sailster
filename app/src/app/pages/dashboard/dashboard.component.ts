import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { PROFILE_ROLES } from '../../../../../api/src/shared/profile/profile-roles.enum';
import { PROFILE_STATUS } from '../../../../../api/src/shared/profile/profile-status.enum';
import { IRequiredAction } from '../../../../../api/src/shared/required-action/required-action.interface';
import { REQUIRED_ACTION_STATE } from '../../../../../api/src/shared/required-action/required-action.state';
import { ISail } from '../../../../../api/src/shared/sail/sail.interface';
import {
  RequiredActions,
  RequiredActionsState,
} from '../../models/required-actions.state';
import { IUpcomingSailsState } from '../../models/upcoming-sails-state.interface';
import {
  adminRoute,
  boatsRoute,
  listChallengesRoute,
  listClinicsRoute,
  sailRequestsRoute,
  sailsRoute,
  viewRequiredActionRoute,
  viewSailRoute,
  viewUserSailsRoute,
} from '../../routes/routes';
import {
  fetchPastSailsForAll,
  fetchPastSailsForUser,
} from '../../store/actions/past-sails.actions';
import { fetchNewRequiredActionsForUser } from '../../store/actions/required-actions.actions';
import {
  fetchUpcomingSailsForAll,
  fetchUpcomingSailsForUser,
} from '../../store/actions/upcoming-sails.actions';
import { STORE_SLICES } from '../../store/store';
import { BasePageComponent } from '../base-page/base-page.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BasePageComponent implements OnInit {

  public ADMIN_ROUTE = adminRoute;
  public BOATS_ROUTE = boatsRoute;
  public SAILS_ROUTE = sailsRoute;
  public SAIL_REQUESTS_ROUTE = sailRequestsRoute;
  public allPastSails: ISail[] = [];
  public allUpcomingSails: ISail[] = [];
  public clinicsLink = listClinicsRoute;
  public listChallengesLink = listChallengesRoute;
  public myPastSails: ISail[] = [];
  public myRequiredActions: IRequiredAction[] = [];
  public myUpcomingSails: ISail[] = [];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
  ) {
    super(store, undefined, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.UPCOMING_SAILS, (upcomingSails: IUpcomingSailsState) => {
      this.myUpcomingSails = upcomingSails[this.user.profile.id] || [];
      this.allUpcomingSails = upcomingSails.all || [];
      this.allUpcomingSails = this.allUpcomingSails
        .filter(sail => !this.myUpcomingSails.find(mySail => mySail.id === sail.id));
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PAST_SAILS, (pastSails: IUpcomingSailsState) => {
      this.myPastSails = pastSails[this.user.profile.id] || [];
      this.allPastSails = pastSails.all || [];
      this.allPastSails = this.allPastSails
        .filter(sail => !this.myPastSails.find(mySail => mySail.id === sail.id));
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.REQUIRED_ACTIONS, (requiredActionsState: RequiredActionsState) => {
      const actions: RequiredActions = requiredActionsState.actions || {};

      this.myRequiredActions = Object
        .values(actions)
        .filter(action => action.assignedTo === this.user.profile.id && action.state === REQUIRED_ACTION_STATE.NEW);
    });

    this.fetchMyUpcomingSails();
    this.fetchOtherUpcomingSails();
    this.fetchMyPastSails();
    this.fetchOtherPastSails();
    this.fetchNewRequiredActionsForUser();
  }

  get upcomingSailRefreshActions(): TypedAction<any>[] {
    return [
      fetchUpcomingSailsForUser({ id: this.user.profile.id }),
      fetchUpcomingSailsForAll({}),
    ];
  }

  get pastSailRefreshActions(): TypedAction<any>[] {
    return [
      fetchPastSailsForUser({ id: this.user.profile.id }),
      fetchPastSailsForAll({}),
    ];
  }

  public gotToRequiredAction(requiredAction: IRequiredAction): void {
    this.goTo([viewRequiredActionRoute(requiredAction.id)]);
  }

  private fetchNewRequiredActionsForUser(): void {
    this.dispatchAction(fetchNewRequiredActionsForUser({ userId: this.user.profile.id }));
  }

  public fetchMyPastSails(notify = false): void {
    this.dispatchAction(fetchPastSailsForUser({ notify, id: this.user.profile.id, query: 'limit=10' }));
  }

  public fetchOtherPastSails(notify = false): void {
    this.dispatchAction(fetchPastSailsForAll({ notify, query: 'limit=10' }));
  }

  public fetchMyUpcomingSails(notify = false): void {
    this.dispatchAction(fetchUpcomingSailsForUser({ notify, id: this.user.profile.id, query: 'limit=10' }));
  }

  public fetchOtherUpcomingSails(notify = false): void {
    this.dispatchAction(fetchUpcomingSailsForAll({ notify, query: 'limit=10' }));
  }

  public viewSail(sail) {
    this.goTo([viewSailRoute(sail.id)], {});
  }

  public get shouldShowSailsControls(): boolean {
    return !!this.user.access.createSail || !!this.user.access.editSail;
  }

  public get shouldShowSailRequestsControls(): boolean {
    if (!this.user) {
      return false;
    }

    const should = this.user.profile.status === PROFILE_STATUS.APPROVED;

    return should;
  }

  public get shouldShowAdminControls(): boolean {
    if (!this.user) {
      return false;
    }

    const userRoles: string[] = this.user.profile.roles || [];
    const should = userRoles.some(role => role === PROFILE_ROLES.ADMIN);

    return should;
  }

  public get shouldShowBoatsControls(): boolean {
    return !!this.user.access.editBoat || !!this.user.access.createBoat;
  }

  public viewUserSailsRouteLink(profileId: string): string {
    return viewUserSailsRoute(profileId);
  }
}
