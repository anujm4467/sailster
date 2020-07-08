import { take } from 'rxjs/operators';
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
import { IProfile } from '../../../../../../api/src/shared/profile/profile.interface';
import { ISail } from '../../../../../../api/src/shared/sail/sail.interface';
import { SnackType } from '../../../models/snack-state.interface';
import { viewSailRoute } from '../../../routes/routes';
import { SailService } from '../../../services/sail.service';
import { putSnack } from '../../../store/actions/snack.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-list-per-person-page',
  templateUrl: './sail-list-per-person-page.component.html',
  styleUrls: ['./sail-list-per-person-page.component.css']
})
export class SailListPerPersonPageComponent extends BasePageComponent implements OnInit {

  public currentCount = 0;
  public fetching = false;
  public paginationSize = 10;
  public profile: IProfile;
  public profileId: string;
  public profileSails: ISail[] = [];
  public totalCount = 0;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(SailService) private sailService: SailService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.profileId = this.route.snapshot.params.profileId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, () => {
      this.profile = this.getProfile(this.profileId);
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);

    this.getLatestSails();
  }

  public get shouldEnableNewerButton(): boolean {
    return this.currentCount > this.paginationSize;
  }

  public get shouldEnableOlderButton(): boolean {
    return this.currentCount < this.totalCount;
  }

  public getLatestSails(): void {
    this.fetching = true;

    const queryString = `limit=${this.paginationSize}&sort=-start`;

    this.sailService
      .fetchUserSail(this.profileId, queryString)
      .pipe(take(1))
      .subscribe((sails) => {
        this.profileSails = sails;
        this.currentCount = sails.length;
        this.fetching = false;
        this.fetchTotalCount();
        this.dispatchAction(putSnack({ snack: { message: `Fetched ${sails.length} sails`, type: SnackType.INFO } }));
      });
  }

  public fetchTotalCount(query?: string) {
    this.fetching = true;
    this.sailService
      .countUserSail(this.profileId, query)
      .pipe(take(1))
      .subscribe((count) => {
        this.totalCount = count;
        this.fetching = false;
      });
  }

  public getNewerSails(): void {
    const firstSail = this.profileSails[0];
    const firstId = firstSail.id;

    this.fetching = true;

    const queryString = `limit=${this.paginationSize}&sort=start&>_id=${firstId}`;

    this.sailService
      .fetchUserSail(this.profileId, queryString)
      .pipe(take(1))
      .subscribe((sails) => {
        this.profileSails = sails.reverse();
        this.fetching = false;
        this.dispatchAction(putSnack({ snack: { message: `Fetched ${sails.length} sails`, type: SnackType.INFO } }));
        this.currentCount = Math.max(0, this.currentCount - sails.length);
      });
  }

  public getOlderSails(): void {
    const lastSail = this.profileSails[this.profileSails.length - 1];
    const lastId = lastSail.id;

    this.fetching = true;

    const queryString = `limit=${this.paginationSize}&sort=-start&<_id=${lastId}`;

    this.sailService
      .fetchUserSail(this.profileId, queryString)
      .pipe(take(1))
      .subscribe((sails) => {
        this.profileSails = sails;
        this.fetching = false;
        this.dispatchAction(putSnack({ snack: { message: `Fetched ${sails.length} sails`, type: SnackType.INFO } }));
        this.currentCount = Math.min(this.totalCount, this.currentCount + sails.length);
      });
  }

  public goToSail(sail: ISail): void {
    this.goTo([viewSailRoute(sail.id)]);
  }

}
