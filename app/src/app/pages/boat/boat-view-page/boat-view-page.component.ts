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
import { IBoat } from '../../../../../../api/src/shared/boat/boat.interface';
import {
  editBoatRoute,
  maintenanceRoute,
  viewBoatInstructionsRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-boat-view-page',
  templateUrl: './boat-view-page.component.html',
  styleUrls: ['./boat-view-page.component.css']
})
export class BoatViewPageComponent extends BasePageComponent implements OnInit {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
  }

  public goToBoatInstructions(): void {
    this.goTo([viewBoatInstructionsRoute(this.boatId)]);
  }

  public get boatId(): string {
    return this.route.snapshot.params.id;
  }

  public get boat(): IBoat {
    return this.boats[this.boatId];
  }

  public get shouldShowEditBoat(): boolean {
    return !!this.user.access.editBoat;
  }

  public editBoat(id): string {
    return editBoatRoute(id);
  }

  public goToBoatMaintenance(): void {
    this.goTo(
      [maintenanceRoute],
      { queryParams: { boatId: this.boatId } },
    );
  }
}
