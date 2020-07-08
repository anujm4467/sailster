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
import { _USER_RUNTIME_CHECKS } from '@ngrx/store/src/tokens';
import {
  arrivalSailChecklistRoute,
  departureSailChecklistRoute,
  editSailChecklistRoute,
  viewSailPeopleManifestRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { SailChecklistBasePageComponent } from '../sail-checklist-base-page/sail-checklist-base-page';

@Component({
  selector: 'app-sail-checklist-view-page',
  templateUrl: './sail-checklist-view-page.component.html',
  styleUrls: ['./sail-checklist-view-page.component.css']
})
export class SailChecklistViewPageComponent extends SailChecklistBasePageComponent implements OnInit {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, route, router, undefined, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.checklistId = this.route.snapshot.params.id;
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHECKLISTS);
  }

  public get editSailchecklistRouteLink(): string {
    return editSailChecklistRoute(this.checklist.id);
  }

  public get departureSailchecklistRouteLink(): string {
    return departureSailChecklistRoute(this.checklist.id);
  }

  public get arrivalSailchecklistRouteLink(): string {
    return arrivalSailChecklistRoute(this.checklist.id);
  }

  public gotToPeopleManifestRouteLink(): void {
    this.goTo([viewSailPeopleManifestRoute(this.checklist.id)]);
  }

  public get shouldAllowEdit(): boolean {
    const user = this.user.profile;

    return this.sail.skipper === user.id || this.sail.crew === user.id;
  }
}
