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
import { ISailPath } from '../../../../../../api/src/shared/sail-path/sail-path.interface';
import { SailPathsState } from '../../../models/sail-paths.state';
import {
  editSailPathRoute,
  recordSailPathRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-path-view-page',
  templateUrl: './sail-path-view-page.component.html',
  styleUrls: ['./sail-path-view-page.component.css']
})
export class SailPathViewPageComponent extends BasePageComponent implements OnInit {

  public sailPath: ISailPath;

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

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_PATHS, (sailPaths: SailPathsState) => {
      const sailPathId = this.sailPathId;
      this.sailPath = sailPaths.sailPaths[sailPathId];
    });
  }

  public get sailPathId(): string {
    return this.route.snapshot.params.sailPathId;
  }

  public get title(): string {
    return 'Sail Path';
  }

  public get shouldShowControls(): boolean {
    return true;
  }

  public editSailPath(): void {
    this.goTo([editSailPathRoute(this.sailPathId)]);
  }

  public recordSailPath(): void {
    this.goTo([recordSailPathRoute(this.sailPathId)]);
  }
}
