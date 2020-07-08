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
import { ISailChecklist } from '../../../../../../api/src/shared/sail-checklist/sail-checklist.interface';
import { MomentService } from '../../../services/moment.service';
import { findSailChecklists } from '../../../store/actions/sail-checklist.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-checklist-list-page',
  templateUrl: './sail-checklist-list-page.component.html',
  styleUrls: ['./sail-checklist-list-page.component.css']
})
export class SailChecklistListPageComponent extends BasePageComponent implements OnInit {

  public checklistIds: string[] = [];
  public boatId: string = null;
  public excludeChecklistId: string = null;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MomentService) private momentService: MomentService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.checklistIds = this.route.snapshot.queryParams.checklistIds;
    this.boatId = this.route.snapshot.queryParams.boatId;
    this.excludeChecklistId = this.route.snapshot.queryParams.excludeChecklistId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHECKLISTS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);

    if (this.boatId) {
      if (this.excludeChecklistId) {
        this.dispatchAction(findSailChecklists({ query: `not=${this.excludeChecklistId}&boat=${this.boatId}&limit=10` }));
      } else {
        this.dispatchAction(findSailChecklists({ query: `boat=${this.boatId}&limit=10` }));
      }
    }
  }

  public get checklists(): ISailChecklist[] {
    const ids = Object.keys(this.sailChecklists);
    const list: ISailChecklist[] = ids
      .filter(id => id !== this.excludeChecklistId)
      .map(id => this.sailChecklists[id])
      .filter(checklist => checklist.boat === this.boatId);

    return list;
  }

  public get boatName(): string {
    return this.getBoat(this.boatId).name;
  }

  public formatDate(date: Date | string): string {
    return this.momentService.format(date);
  }

}
