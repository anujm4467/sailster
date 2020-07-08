import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IBoat } from '../../../../../../api/src/shared/boat/boat.interface';
import {
  createBoatRoute,
  maintenanceRoute,
  viewBoatRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-boat-list-page',
  templateUrl: './boat-list-page.component.html',
  styleUrls: ['./boat-list-page.component.css']
})
export class BoatListPageComponent extends BasePageComponent implements OnInit {

  public CREATE_BOAT_ROUTE = createBoatRoute;
  public MAINTENANCE_ROUTE = maintenanceRoute;

  constructor(
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
  ) {
    super(store, undefined, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);

    this.refreshBoats(false);
  }

  public refreshBoats(notify?: boolean): void {
    this.fetchBoats(notify);
  }

  public get boatsArray(): IBoat[] {
    return Object
      .keys(this.boats || {})
      .map(id => this.boats[id]);
  }

  public clickedBoat(boat: IBoat): void {
    this.goTo([viewBoatRoute(boat.id)]);
  }

  public get shouldEnableNewButton(): boolean {
    return !!this.user.access.createBoat;
  }

}
