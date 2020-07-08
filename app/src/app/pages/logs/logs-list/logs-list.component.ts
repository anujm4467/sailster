import {
  fromEvent,
  of,
} from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  switchMap,
  take,
  takeWhile,
} from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  ILog,
  LOG_TYPE,
} from '../../../../../../api/src/shared/log/log.interface';
import { IProfile } from '../../../../../../api/src/shared/profile/profile.interface';
import { SnackType } from '../../../models/snack-state.interface';
import { LogsService } from '../../../services/logs.service';
import { ProfileService } from '../../../services/profile.service';
import { putProfiles } from '../../../store/actions/profile.actions';
import { putSnack } from '../../../store/actions/snack.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.css']
})
export class LogsListComponent extends BasePageComponent implements OnInit, AfterViewInit {

  @ViewChild('profileSearchInput', { static: false }) private profileSearchInput;
  public currentCount = 0;
  public debounceTime = 1000;
  public fetching = false;
  public logTypes = LOG_TYPE;
  public logs: ILog[] = [];
  public paginationSize = 10;
  public searchedProfiles: IProfile[] = [];
  public totalCount = 0;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(LogsService) private logService: LogsService,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ProfileService) private profileService: ProfileService,
  ) {
    super(store, undefined, router, dialog);
  }

  ngAfterViewInit(): void {
    const typeahead = fromEvent(this.profileSearchInput.nativeElement, 'input')
      .pipe(
        takeWhile(() => this.active),
        map((e: any) => (e.target.value || '') as string),
        debounceTime(this.debounceTime),
        map(text => text ? text.trim() : ''),
        filter(text => !text || text.length > 3),
        switchMap((text) => {
          if (!text) {
            return of([]);
          }

          return this.profileService.searchByNameOrEmail(text);
        }),
      );

    typeahead
      .subscribe((profiles) => {
        this.dispatchAction(
          putSnack({ snack: { type: SnackType.INFO, message: `Found ${profiles.length} users.` } })
        );
        this.searchedProfiles = profiles;
        this.dispatchAction(putProfiles({ profiles: profiles || [] }));
        this.getLatestLogs();
      });

    super.ngAfterViewInit();
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.getLatestLogs();
  }

  public getLatestLogs() {
    this.fetching = true;

    const userIds = this.searchedProfiles.map(profile => profile.id);
    let queryString = `limit=${this.paginationSize}&sort=-createdAt`;
    let userIdsQuery = '';

    if (userIds.length) {
      userIdsQuery = `user=${userIds.join('&user=')}`;
      queryString = `${queryString}&${userIdsQuery}`;
    }

    this.logService.fetchLogs(queryString).pipe(take(1)).subscribe((logs) => {
      this.logs = logs;
      this.currentCount = logs.length;
      this.fetching = false;
      this.fetchTotalCount(userIdsQuery);
      this.dispatchAction(putSnack({ snack: { message: `Fetched ${logs.length} logs`, type: SnackType.INFO } }));
    });
  }

  public fetchTotalCount(query?: string) {
    this.fetching = true;
    this.logService.fetchCount(query).pipe(take(1)).subscribe((count) => {
      this.totalCount = count;
      this.fetching = false;
    });
  }

  public getOlderLogs() {
    const lastLog = this.logs[this.logs.length - 1];
    const lastId = lastLog.id;

    this.fetching = true;

    const userIds = this.searchedProfiles.map(profile => profile.id);
    let queryString = `limit=${this.paginationSize}&sort=-createdAt&<_id=${lastId}`;
    let userIdsQuery = '';

    if (userIds.length) {
      userIdsQuery = `user=${userIds.join('&user=')}`;
      queryString = `${queryString}&${userIdsQuery}`;
    }

    this.logService.fetchLogs(queryString).pipe(take(1)).subscribe((logs) => {
      this.logs = logs;
      this.fetching = false;
      this.dispatchAction(putSnack({ snack: { message: `Fetched ${logs.length} logs`, type: SnackType.INFO } }));
      this.currentCount = Math.min(this.totalCount, this.currentCount + logs.length);
    });
  }

  public getNewerLogs() {
    const firstLog = this.logs[0];
    const firstId = firstLog.id;

    this.fetching = true;

    const userIds = this.searchedProfiles.map(profile => profile.id);
    let queryString = `limit=${this.paginationSize}&sort=createdAt&>_id=${firstId}`;
    let userIdsQuery = '';

    if (userIds.length) {
      userIdsQuery = `user=${userIds.join('&user=')}`;
      queryString = `${queryString}&${userIdsQuery}`;
    }

    this.logService.fetchLogs(queryString).pipe(take(1)).subscribe((logs) => {
      this.logs = logs.reverse();
      this.fetching = false;
      this.dispatchAction(putSnack({ snack: { message: `Fetched ${logs.length} logs`, type: SnackType.INFO } }));
      this.currentCount = Math.max(0, this.currentCount - logs.length);
    });
  }

  public get shouldEnableNewerButton(): boolean {
    return this.currentCount > this.paginationSize;
  }

  public get shouldEnableOlderButton(): boolean {
    return this.currentCount < this.totalCount;
  }

}
