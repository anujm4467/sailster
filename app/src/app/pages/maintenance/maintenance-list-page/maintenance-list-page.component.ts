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
import { MAINTENANCE_STATUS } from '../../../../../../api/src/shared/maintenance/maintenance-status.enum';
import {
  IBoatMaintenance,
  MAINTENANCE_PROPS,
} from '../../../../../../api/src/shared/maintenance/maintenance.interface';
import {
  createMaintenanceRoute,
  viewMaintenanceRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-maintenance-list-page',
  templateUrl: './maintenance-list-page.component.html',
  styleUrls: ['./maintenance-list-page.component.css']
})
export class MaintenanceListPageComponent extends BasePageComponent implements OnInit {
  public boatId: string;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.boatId = this.route.snapshot.queryParams.boatId;
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOAT_MAINTENANCES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.LOGIN, () => {
      if (this.user) {
        this.fetchRecentNewRequests(this.boatId);
        this.fetchRecentResolvedRequests(this.boatId);
        this.fetchRecentInProgressRequests(this.boatId);
      }
    });
  }

  public get boatName(): string {
    if (!this.boatId) {
      return '';
    }

    return this.getBoat(this.boatId).name;
  }
  public fetchRecentNewRequests(boatId: string, notify: boolean = false): void {
    if (boatId) {
      this.fetchBoatMaintenances(`boat=${boatId}&status=${MAINTENANCE_STATUS.NEW}&limit=10`, notify);
    } else {
      this.fetchBoatMaintenances(`status=${MAINTENANCE_STATUS.NEW}&limit=10`, notify);
    }
  }

  public fetchRecentResolvedRequests(boatId: string, notify: boolean = false): void {
    if (boatId) {
      this.fetchBoatMaintenances(
        `boat=${boatId}&status=${MAINTENANCE_STATUS.RESOLVED}&limit=10&sort=-${MAINTENANCE_PROPS.SERVICED_ON}`, notify);
    } else {
      this.fetchBoatMaintenances(
        `status=${MAINTENANCE_STATUS.RESOLVED}&limit=10&sort=-${MAINTENANCE_PROPS.SERVICED_ON}`, notify);
    }
  }

  public fetchRecentInProgressRequests(boatId: string, notify: boolean = false): void {
    if (boatId) {
      this.fetchBoatMaintenances(`boat=${boatId}&status=${MAINTENANCE_STATUS.IN_PROGRESS}&limit=10`, notify);
    } else {
      this.fetchBoatMaintenances(`status=${MAINTENANCE_STATUS.IN_PROGRESS}&limit=10`, notify);
    }
  }

  private filterAndSort(requests: IBoatMaintenance[], status: MAINTENANCE_STATUS, boatId?: string): IBoatMaintenance[] {
    return requests
      .filter(request => request.status === status)
      .filter(request => boatId ? request.boat === boatId : true)
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

  }
  public get newRequests(): IBoatMaintenance[] {
    return this.filterAndSort(this.maintenancesArray, MAINTENANCE_STATUS.NEW, this.boatId);
  }

  public get resolvedRequests(): IBoatMaintenance[] {
    return this.filterAndSort(this.maintenancesArray, MAINTENANCE_STATUS.RESOLVED, this.boatId);
  }

  public get inProgressRequests(): IBoatMaintenance[] {
    return this.filterAndSort(this.maintenancesArray, MAINTENANCE_STATUS.IN_PROGRESS, this.boatId);
  }

  public goToViewMaintenance(request: IBoatMaintenance): void {
    this.goTo([viewMaintenanceRoute(request.id)]);
  }

  public goToCreateNewMaintenance(): void {
    if (this.boatId) {
      this.goTo([createMaintenanceRoute], { queryParams: { boatId: this.boatId } });
    } else {
      this.goTo([createMaintenanceRoute]);
    }
  }
}
