import {
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { ISailRequest } from '../../../../../../api/src/shared/sail-request/sail-request.interface';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  template: ''
})
export class SailRequestBasePageComponent extends BasePageComponent implements OnInit {

  constructor(
    store: Store<any>,
    route: ActivatedRoute,
    router: Router,
    dialog?: MatDialog,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_REQUESTS);
  }

  public get sailRequestId(): string {
    return this.route.snapshot.params.id;
  }

  public get sailRequest(): ISailRequest {
    const id = this.sailRequestId;
    if (!id) {
      return;
    }

    return this.sailRequests[id];
  }

}
