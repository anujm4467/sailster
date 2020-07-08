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
import { ISailPath } from '../../../../../../api/src/shared/sail-path/sail-path.interface';
import { SailPathsState } from '../../../models/sail-paths.state';
import { viewSailPathRoute } from '../../../routes/routes';
import {
  createSailPath,
  fetchSailPathsForSail,
} from '../../../store/actions/sail-path.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-path-list-page',
  templateUrl: './sail-path-list-page.component.html',
  styleUrls: ['./sail-path-list-page.component.css']
})
export class SailPathListPageComponent extends BasePageComponent implements OnInit {

  public sailPaths: ISailPath[] = [];

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
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_PATHS, (sailPaths: SailPathsState) => {
      const sail = this.sailId;
      this.sailPaths = Object.values(sailPaths.sailPaths).filter(sailPath => sailPath.sail === sail);
    });

    this.fetchSailPaths();
  }

  public get sailId(): string {
    return this.route.snapshot.params.sailId;
  }

  private fetchSailPaths() {
    this.dispatchAction(fetchSailPathsForSail({ sailId: this.sailId }));
  }

  public get title(): string {
    const sail = this.getSail(this.sailId) || {};
    return `Sail Paths for Sail: ${sail.name}`;
  }

  public get shouldShowControls(): boolean {
    return true;
  }

  public viewSailPath(sailPathId: string): void {
    this.goTo([viewSailPathRoute(sailPathId)]);
  }

  public get allowCreateNewPath(): boolean {
    const sail = this.getSail(this.sailId) || {};

    if (!sail) {
      return false;
    }

    return sail.skipper === this.user.profile.id
      || sail.crew === this.user.profile.id
      || (sail.passengers || []).includes(this.user.profile.id);
  }

  public createNewSailPath(): void {
    const sailPath: ISailPath = {
      submittedBy: this.user.profile.id,
      submittedOn: new Date(),
      sail: this.sailId,
    };

    this.dispatchAction(createSailPath({ sailPath, notify: true, goToEdit: true }));
  }
}
