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
import { MAINTENANCE_STATUS } from '../../../../../../api/src/shared/maintenance/maintenance-status.enum';
import { IBoatMaintenance } from '../../../../../../api/src/shared/maintenance/maintenance.interface';
import {
  editMaintenanceRoute,
  resolveMaintenanceRoute,
} from '../../../routes/routes';
import { postBoatMaintenanceComment } from '../../../store/actions/boat-maintenance.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-maintenance-view-page',
  templateUrl: './maintenance-view-page.component.html',
  styleUrls: ['./maintenance-view-page.component.css']
})
export class MaintenanceViewPageComponent extends BasePageComponent implements OnInit {

  public maintenanceId: string;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.maintenanceId = this.route.snapshot.params.id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOAT_MAINTENANCES);
  }

  public get editMaintenanceLink(): string {
    return editMaintenanceRoute(this.maintenanceId);
  }

  public get resolveMaintenanceLink(): string {
    return resolveMaintenanceRoute(this.maintenanceId);
  }

  public get title(): string {
    const title = 'Maintenance Request';
    return title;
  }

  public get isMaintenanceResolved(): boolean {
    return this.maintenance.status === MAINTENANCE_STATUS.RESOLVED;
  }

  public get maintenance(): IBoatMaintenance {
    if (!this.maintenanceId) {
      return;
    }

    const request = this.maintenances[this.maintenanceId];

    if (request === undefined) {
      this.fetchBoatMaintenance(this.maintenanceId);
    }

    return request;
  }

  public postNewComment(comment: IComment): void {
    this.dispatchAction(postBoatMaintenanceComment({ comment, id: this.maintenanceId, notify: true }));
  }

  public get shouldEnableEditButton(): boolean {
    return !!this.user.access.editMaintenanceRequest;
  }

  public get shouldEnableResolveButton(): boolean {
    return !!this.user.access.resolveMaintenanceRequest;
  }
}
