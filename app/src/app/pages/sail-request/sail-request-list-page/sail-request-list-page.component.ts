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
import { SAIL_REQUEST_STATUS } from '../../../../../../api/src/shared/sail-request/sail-request-status';
import {
  ISailRequest,
  SAIL_REQUEST_PROPS,
} from '../../../../../../api/src/shared/sail-request/sail-request.interface';
import {
  createSailRequestRoute,
  editSailRequestRoute,
} from '../../../routes/routes';
import {
  cancelSailRequest,
  fetchSailRequests,
} from '../../../store/actions/sail-request.actions';
import { SailRequestBasePageComponent } from '../sail-request-base-page/sail-request-base-page.component';

@Component({
  selector: 'app-sail-request-list-page',
  templateUrl: './sail-request-list-page.component.html',
  styleUrls: ['./sail-request-list-page.component.css']
})
export class SailRequestListPageComponent extends SailRequestBasePageComponent implements OnInit {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    super.ngOnInit();

    this.fetchNewRequests(false);
  }

  public fetchNewRequests(notify?: boolean): void {
    this.dispatchAction(fetchSailRequests({ notify, query: `${SAIL_REQUEST_PROPS.STATUS}=${SAIL_REQUEST_STATUS.NEW}` }));
    this.dispatchAction(fetchSailRequests({ notify, query: `${SAIL_REQUEST_PROPS.STATUS}=${SAIL_REQUEST_STATUS.SCHEDULED}&limit=10` }));
    this.dispatchAction(fetchSailRequests({ notify, query: `${SAIL_REQUEST_PROPS.STATUS}=${SAIL_REQUEST_STATUS.CANCELLED}&limit=10` }));
    this.dispatchAction(fetchSailRequests({ notify, query: `${SAIL_REQUEST_PROPS.STATUS}=${SAIL_REQUEST_STATUS.EXPIRED}&limit=10` }));
  }

  public get newSailRequestsArray(): ISailRequest[] {
    return this.getSailRequestArray(SAIL_REQUEST_STATUS.NEW);
  }

  public get scheduledSailRequestsArray(): ISailRequest[] {
    return this.getSailRequestArray(SAIL_REQUEST_STATUS.SCHEDULED);
  }

  public get expiredSailRequestsArray(): ISailRequest[] {
    return this.getSailRequestArray(SAIL_REQUEST_STATUS.EXPIRED);
  }

  public get cancelledSailRequestsArray(): ISailRequest[] {
    return this.getSailRequestArray(SAIL_REQUEST_STATUS.CANCELLED);
  }

  private getSailRequestArray(requestStatus: SAIL_REQUEST_STATUS): ISailRequest[] {
    const sailRequests = this.sailRequests;
    const array = Object
      .values(sailRequests)
      .filter(request => request.status === requestStatus)
      .sort((a, b) => {

        // NEW status should be top of the list
        if (a.status === SAIL_REQUEST_STATUS.NEW && b.status !== SAIL_REQUEST_STATUS.NEW) {
          return -1;
        }

        // NEW status should be top of the list
        if (b.status === SAIL_REQUEST_STATUS.NEW && a.status !== SAIL_REQUEST_STATUS.NEW) {
          return 1;
        }

        if (b.status === a.status) {
          // sort by oldest date when status is the same
          return (new Date(a.start).getTime() - new Date(b.start).getTime());
        }

        if (a.status < b.status) {
          return -1;
        }

        if (a.status > b.status) {
          return 1;
        }

        return 0;
      });

    return array;
  }

  public get createSailRequestRouteLink(): string {
    return createSailRequestRoute.toString();
  }

  public editSailRequest(id: string): void {
    this.goTo([editSailRequestRoute(id)]);
  }

  public cancelRequest(id: string): void {
    this.dispatchAction(cancelSailRequest({ id }));
  }
}
