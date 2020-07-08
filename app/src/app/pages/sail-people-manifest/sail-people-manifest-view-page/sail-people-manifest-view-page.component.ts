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
import { IPerson } from '../../../../../../api/src/shared/sail-checklist/person.interface';
import { ISailChecklist } from '../../../../../../api/src/shared/sail-checklist/sail-checklist.interface';
import { ISail } from '../../../../../../api/src/shared/sail/sail.interface';
import {
  editSailPeopleManifestRoute,
  viewSailRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-people-manifest-view-page',
  templateUrl: './sail-people-manifest-view-page.component.html',
  styleUrls: ['./sail-people-manifest-view-page.component.css']
})
export class SailPeopleManifestViewPageComponent extends BasePageComponent implements OnInit {

  public checklistId: string;
  public peopleManife: IPerson[] = [];

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

    this.checklistId = this.route.snapshot.params.checklistId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHECKLISTS, () => {
      const checklist = this.sailChecklists[this.checklistId];

      if (checklist) {
        this.peopleManife = checklist.peopleManifest;
      }
    });
  }

  public get checklist(): ISailChecklist {
    return this.sailChecklists[this.checklistId];
  }

  public get sail(): ISail {
    if (this.checklist) {
      return this.getSail(this.checklist.sail);
    }

    return null;
  }

  public goToSailPage(): void {
    this.goTo([viewSailRoute(this.checklist.sail)]);
  }

  public editSailManifest(): void {
    this.goTo([editSailPeopleManifestRoute(this.checklistId)]);
  }

  public get shouldAllowEditManifest(): boolean {
    const sail = this.sail;

    if (!sail) {
      return false;
    }

    return sail.skipper === this.user.profile.id || sail.crew === this.user.profile.id;
  }
}
