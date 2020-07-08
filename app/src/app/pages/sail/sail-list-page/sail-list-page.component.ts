import {
  fromEvent,
  of,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeWhile,
} from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IBoat } from '../../../../../../api/src/shared/boat/boat.interface';
import { PROFILE_ROLES } from '../../../../../../api/src/shared/profile/profile-roles.enum';
import { IProfile } from '../../../../../../api/src/shared/profile/profile.interface';
import { SAIL_STATUS } from '../../../../../../api/src/shared/sail/sail-status';
import {
  createSailRoute,
  sailRequestsRoute,
} from '../../../routes/routes';
import { BoatService } from '../../../services/boat.service';
import { ProfileService } from '../../../services/profile.service';
import { searchSails } from '../../../store/actions/sail.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-list-page',
  styleUrls: ['./sail-list-page.component.css'],
  templateUrl: './sail-list-page.component.html',
})
export class SailListPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  @ViewChild('boatFilter', { static: false }) boatFilter: any;
  @ViewChild('crewFilter', { static: false }) crewFilter: any;
  @ViewChild('passengerFilter', { static: false }) passengerFilter: any;
  @ViewChild('skipperFilter', { static: false }) skipperFilter: any;
  private selectedBoatId = 'initial';
  private selectedCrewId = 'initial';
  private selectedPassengerId = 'initial';
  private selectedSkipperId = 'initial';
  public CREATE_SAIL_ROUTE = createSailRoute;
  public VIEW_SAIL_REQUESTS_ROUTE = sailRequestsRoute;
  public availableBoats: IBoat[];
  public availableCrew: IProfile[];
  public availablePassengers: IProfile[];
  public availableSkippers: IProfile[];
  public endFilter: string;
  public nameFilter: string;
  public noBoatAssigned = false;
  public noCrewAssigned = false;
  public noPassengersAssigned = false;
  public noSkipperAssigned = false;
  public sailStatus: SAIL_STATUS | 'ANY' = 'ANY';
  public sailStatusValues = { ...SAIL_STATUS, ANY: 'ANY' };
  public startFilter: string;

  constructor(
    @Inject(BoatService) private boatService: BoatService,
    @Inject(ProfileService) private profileService: ProfileService,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
  ) {
    super(store, undefined, router);
  }

  ngAfterViewInit(): void {
    fromEvent(this.skipperFilter.nativeElement, 'keyup')
      .pipe(
        takeWhile(() => this.active),
        debounceTime(500),
        map((e: any) => e.target.value),
        distinctUntilChanged(),
        switchMap(keys => this.profileRequest(keys)),
      ).subscribe(data => this.availableSkippers = data);

    fromEvent(this.crewFilter.nativeElement, 'keyup')
      .pipe(
        takeWhile(() => this.active),
        debounceTime(500),
        map((e: any) => e.target.value),
        distinctUntilChanged(),
        switchMap(keys => this.profileRequest(keys)),
      ).subscribe(data => this.availableCrew = data);

    fromEvent(this.passengerFilter.nativeElement, 'keyup')
      .pipe(
        takeWhile(() => this.active),
        debounceTime(500),
        map((e: any) => e.target.value),
        distinctUntilChanged(),
        switchMap(keys => this.profileRequest(keys)),
      ).subscribe(data => this.availablePassengers = data);

    fromEvent(this.boatFilter.nativeElement, 'keyup')
      .pipe(
        takeWhile(() => this.active),
        debounceTime(500),
        map((e: any) => e.target.value),
        distinctUntilChanged(),
        switchMap(keys => this.boatRequest(keys)),
      ).subscribe(data => this.availableBoats = data);
    super.ngAfterViewInit();
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
  }

  public resetFilter() {
    this.boatFilter.nativeElement.value = '';
    this.crewFilter.nativeElement.value = '';
    this.endFilter = null;
    this.nameFilter = null;
    this.noBoatAssigned = false;
    this.noCrewAssigned = false;
    this.noPassengersAssigned = false;
    this.noSkipperAssigned = false;
    this.passengerFilter.nativeElement.value = '';
    this.sailStatus = 'ANY';
    this.selectedBoatId = 'initial';
    this.selectedCrewId = 'initial';
    this.selectedPassengerId = 'initial';
    this.selectedSkipperId = 'initial';
    this.skipperFilter.nativeElement.value = '';
    this.startFilter = null;
  }

  public goToViewSail(id: string): void {
    this.viewSail(id);
  }

  public loadBoat(id: string): void {
    this.fetchBoat(id);
  }

  public fetchSails(notify = false): void {

    let query = '';

    if (this.nameFilter) {
      query = `${query}&name=${this.nameFilter}`;
    }

    if (this.startFilter) {
      const startUTC = new Date(`${this.startFilter}T00:00:00`).toISOString();
      query = `${query}&start=${startUTC}`;
    }

    if (this.endFilter) {
      const endUTC = new Date(`${this.endFilter}T23:59:59`).toISOString();
      query = `${query}&end=${endUTC}`;
    }

    if (this.noBoatAssigned) {
      query = `${query}&boat=null`;
    } else if (this.selectedBoatId === 'any' || this.selectedBoatId === 'initial') {
      // do not set filter
    } else if (this.selectedBoatId) {
      query = `${query}&boat=${this.selectedBoatId}`;
    }

    if (this.noSkipperAssigned) {
      query = `${query}&skipper=null`;
    } else if (this.selectedSkipperId === 'any' || this.selectedSkipperId === 'initial') {
      // do not set filter
    } else if (this.selectedSkipperId) {
      query = `${query}&skipper=${this.selectedSkipperId}`;
    }

    if (this.noCrewAssigned) {
      query = `${query}&crew=null`;
    } else if (this.selectedCrewId === 'any' || this.selectedCrewId === 'initial') {
      // do not set filter
    } else if (this.selectedCrewId) {
      query = `${query}&crew=${this.selectedCrewId}`;
    }

    if (this.noPassengersAssigned) {
      query = `${query}&passenger=null`;
    } else if (this.selectedPassengerId === 'any' || this.selectedPassengerId === 'initial') {
      // do not set filter
    } else if (this.selectedPassengerId) {
      query = `${query}&passenger=${this.selectedPassengerId}`;
    }

    if (this.sailStatus && this.sailStatus !== 'ANY') {
      query = `${query}&status=${this.sailStatus}`;
    }

    this.dispatchAction(searchSails({ notify, query }));
  }

  private profileRequest(name: string) {
    const defaults = [{ name: 'any', id: 'any' }, { name: 'not assigned', id: 'null' }];

    if (!name || name.length < 4) {
      return of(defaults);
    }

    return this.profileService
      .searchByName(name, 3)
      .pipe(
        map(profiles => []
          .concat(profiles || [])
          .concat(defaults)
        )
      );
  }

  private boatRequest(name) {
    const defaults = [{ name: 'any', id: 'any' }, { name: 'not assigned', id: 'null' }];

    if (!name || name.length < 4) {
      return of(defaults);
    }

    return this.boatService
      .findByName(name)
      .pipe(
        map(boats => []
          .concat(boats || [])
          .concat(defaults)
        )
      );
  }

  public skipperSelect(event) {
    this.selectedSkipperId = event.option._element.nativeElement.attributes.skipperId.value;
  }

  public crewSelect(event) {
    this.selectedCrewId = event.option._element.nativeElement.attributes.crewId.value;
  }

  public passengerSelect(event) {
    this.selectedPassengerId = event.option._element.nativeElement.attributes.passengerId.value;
  }

  public boatSelect(event) {
    this.selectedBoatId = event.option._element.nativeElement.attributes.boatId.value;
  }

  public get shouldShowControls(): boolean {
    const user = this.user;

    if (!user) {
      return false;
    }

    const roles: string[] = user.roles || [];
    const should = roles.some(role => role === PROFILE_ROLES.ADMIN || role === PROFILE_ROLES.COORDINATOR);

    return should;
  }

}
