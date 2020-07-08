import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { IComment } from '../../../../../../api/src/shared/comment/comment.interface';
import { PROFILE_ROLES } from '../../../../../../api/src/shared/profile/profile-roles.enum';
import { IProfile } from '../../../../../../api/src/shared/profile/profile.interface';
import { SAIL_STATUS } from '../../../../../../api/src/shared/sail/sail-status';
import { ISail } from '../../../../../../api/src/shared/sail/sail.interface';
import { User } from '../../../models/user.interface';
import {
  cancelSailRoute,
  editSailRoute,
  listFeedbackRoute,
  listSailPathsRoute,
  viewSailChecklistRoute,
  viewSailPicturesRoute,
} from '../../../routes/routes';
import {
  completeSail,
  joinSailAsCrew,
  joinSailAsPassenger,
  joinSailAsSkipper,
  leaveSail,
  postSailComment,
  startSail,
} from '../../../store/actions/sail.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-view-page',
  styleUrls: ['./sail-view-page.component.css'],
  templateUrl: './sail-view-page.component.html',
})
export class SailViewPageComponent extends BasePageComponent implements OnInit {

  private sailId: string;
  public passengerSpots: number[] = [];
  public sailPassengers: string[] = [];
  public sail: ISail;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.sailId = this.route.snapshot.params.id;
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      this.sail = this.getSail(this.sailId);

      if (this.sail) {
        this.passengerSpots = [].constructor((this.sail.maxOccupancy || 6) - 2);
        this.sailPassengers = this.sail.passengers || [];
      }

    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SKIPPERS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CREW);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHECKLISTS);
  }

  public postNewComment(comment: IComment): void {
    this.dispatchAction(postSailComment({ comment, sailId: this.sailId, notify: true }));
  }

  public goToSailPicturesPage(): void {
    this.goTo([viewSailPicturesRoute(this.sailId)]);
  }

  public get isSailCancelled(): boolean {
    if (!this.sail) {
      return false;
    }
    return this.sail.status === SAIL_STATUS.CANCELLED;
  }
  public get viewSailchecklistRouteLink(): string {
    return viewSailChecklistRoute(this.sail.checklist);
  }

  public get canViewChecklist(): boolean {
    const sail = this.sail;
    const sailStatus = sail.status;

    return sailStatus === SAIL_STATUS.STARTED || sailStatus === SAIL_STATUS.COMPLETED;
  }

  public get isUserSailSkipper(): boolean {
    if (!this.user) {
      return false;
    }

    const is = this.user.profile.id === this.sail.skipper;

    return is;
  }

  public get isUserSailCrew(): boolean {
    if (!this.user) {
      return false;
    }

    const is = this.user.profile.id === this.sail.crew;

    return is;
  }

  public get canViewFeedback(): boolean {
    const sail = this.sail;
    const sailStatus = sail.status;

    return sailStatus === SAIL_STATUS.COMPLETED;
  }

  public get canViewSailPaths(): boolean {
    return true;
  }

  public get viewSailFeedbackRouteLink(): string {
    return listFeedbackRoute(this.sailId);
  }

  public get viewSailPathsRouteLink(): string {
    return listSailPathsRoute(this.sailId);
  }

  public get canEditSail(): boolean {
    const user = this.user;
    const roles: string[] = user.roles || [];
    const isSkipper = roles.includes(PROFILE_ROLES.SKIPPER) && this.isUserSailSkipper;

    return isSkipper || this.user.access.editSail;
  }

  public get canCancelSail(): boolean {
    const sail = this.sail;

    if (sail.status !== SAIL_STATUS.NEW) {
      return false;
    }

    return this.canEditSail;
  }

  private isUserInSail(sail: ISail = {}, user: User): boolean {
    let inSail = false;

    if (sail.skipper) {
      inSail = sail.skipper === user.profile.id;
    }

    if (sail.crew && !inSail) {
      inSail = sail.crew === user.profile.id;
    }

    if (sail.passengers && !inSail) {
      inSail = !!sail.passengers.find(passenger => passenger === user.profile.id);
    }

    return inSail;
  }

  public get isInPast() {
    const sail = this.sail;
    const start = new Date(sail.start);
    const now = new Date();
    const past = start.getTime() < now.getTime();

    return !!past;
  }

  public get canJoinSail(): boolean {
    if (this.isInPast) {
      return false;
    }

    if (this.isSailFull) {
      return false;
    }

    const sail = this.sail;

    if (sail.status !== SAIL_STATUS.NEW) {
      return false;
    }

    return true;
  }

  public get canLeaveSail(): boolean {
    if (this.isInPast) {
      return false;
    }

    const sail = this.sail;

    if (sail.status !== SAIL_STATUS.NEW) {
      return false;
    }

    const user = this.user;
    const can = this.isUserInSail(sail, user);

    return can;
  }

  public get canJoinCrew(): boolean {
    if (this.isInPast) {
      return false;
    }

    const sail = this.sail;

    if (sail.status !== SAIL_STATUS.NEW) {
      return false;
    }

    if (sail.crew) {
      return false;
    }

    const user = this.user;

    if (this.isUserInSail(sail, user)) {
      return false;
    }

    const can = user.roles.includes(PROFILE_ROLES.CREW);

    return can;
  }

  public get canJoinSkipper(): boolean {
    if (this.isInPast) {
      return false;
    }

    const sail = this.sail;

    if (sail.status !== SAIL_STATUS.NEW) {
      return false;
    }

    if (sail.skipper) {
      return false;
    }

    const user = this.user;

    if (this.isUserInSail(sail, user)) {
      return false;
    }

    const can = user.roles.includes(PROFILE_ROLES.SKIPPER);

    return can;
  }

  public get canJoinPassenger(): boolean {
    if (this.isInPast) {
      return false;
    }

    if (this.isSailFull) {
      return false;
    }

    const sail = this.sail;

    if (sail.status !== SAIL_STATUS.NEW) {
      return false;
    }

    const user = this.user;

    if (this.isUserInSail(sail, user)) {
      return false;
    }

    const can = user.roles.includes(PROFILE_ROLES.MEMBER);

    return can;
  }

  public cancelSail(): void {
    this.goTo([cancelSailRoute(this.sailId)]);
  }

  public get isSailFull(): boolean {
    const sail = this.sail;

    if (!sail) {
      return true;
    }

    let count = 0;

    if (sail.skipper) {
      count = count + 1;
    }

    if (sail.crew) {
      count = count + 1;
    }

    if (sail.passengers) {
      count = count + sail.passengers.length;
    }

    const isFull = count >= sail.maxOccupancy;

    return isFull;
  }

  public editSailLink(id): string {
    return editSailRoute(id);
  }

  public joinSailAsCrew(): void {
    const sail = this.sail;

    this.dispatchAction(joinSailAsCrew({ sailId: sail.id, notify: true }));
  }

  public joinSailAsPassenger(): void {
    const sail = this.sail;

    this.dispatchAction(joinSailAsPassenger({ sailId: sail.id, notify: true }));
  }

  public joinSailAsSkipper(): void {
    const sail = this.sail;

    this.dispatchAction(joinSailAsSkipper({ sailId: sail.id, notify: true }));
  }

  public leaveSail(): void {
    const sail = this.sail;

    this.dispatchAction(leaveSail({ sailId: sail.id, notify: true }));
  }

  public getPassengers(sail: ISail): IProfile[] {
    const passengers = (sail.passengers || [])
      .map((passenger) => {
        const profile = this.members[passenger] || this.profiles[passenger];
        if (profile === undefined) {
          this.fetchProfile(passenger);
          return { name: 'Loading' };
        }
        return profile || { name: 'Error loading profile' };
      });

    return passengers;
  }

  public getPassengerNames(sail: ISail): string[] {
    const passengers = this.getPassengers(sail) || [];
    const names = passengers.map(passenger => passenger.name);

    return names;
  }

  public getPassengerLabel(spot: number): string {
    let label = '';
    const profileId = this.sailPassengers[spot];

    if (profileId) {
      const profile = this.getProfile(profileId);
      label = `${(profile || {}).name}. Click to open profile dialog.`;
    } else {
      label = `-empty-`;
    }

    return label;
  }

  public get canStartSail(): boolean {
    const sail = this.sail;

    if (sail.status !== SAIL_STATUS.NEW) {
      return false;
    }

    if (!sail.skipper) {
      return false;
    }

    if (!sail.crew) {
      return false;
    }

    if (!sail.boat) {
      return false;
    }

    const start = new Date(sail.start).getTime();
    const now = new Date().getTime();
    const timeToStart = start - now;

    if (timeToStart > 1000 * 60 * 60) {
      return false;
    }

    const user = this.user;

    const roles: string[] = user.roles || [];
    const isSkipperOrCrew = roles.some(role => role === PROFILE_ROLES.SKIPPER || role === PROFILE_ROLES.CREW);

    if (isSkipperOrCrew && (this.isUserSailSkipper || this.isUserSailCrew)) {
      return true;
    }

    return false;
  }

  public get canEndSail(): boolean {
    const sail = this.sail;

    if (sail.status !== SAIL_STATUS.STARTED) {
      return false;
    }

    const user = this.user;

    const roles: string[] = user.roles || [];
    const isSkipperOrCrew = roles.some(role => role === PROFILE_ROLES.SKIPPER || role === PROFILE_ROLES.CREW);

    if (isSkipperOrCrew && (this.isUserSailSkipper || this.isUserSailCrew)) {
      return true;
    }

    return false;
  }

  public startSail(): void {
    this.dispatchAction(startSail({ sail: this.sail, notify: true }));
  }

  public endSail(): void {
    this.dispatchAction(completeSail({ sail: this.sail, notify: true }));
  }

}
