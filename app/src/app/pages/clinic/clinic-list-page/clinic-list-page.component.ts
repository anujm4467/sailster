import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IClinic } from '../../../../../../api/src/shared/clinic/clinic.interface';
import {
  createClinicRoute,
  viewClinicRoute,
} from '../../../routes/routes';
import { fetchClinics } from '../../../store/actions/clinic.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-clinic-list-page',
  templateUrl: './clinic-list-page.component.html',
  styleUrls: ['./clinic-list-page.component.css']
})
export class ClinicListPageComponent extends BasePageComponent implements OnInit {

  public clinicsArray: IClinic[] = [];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, undefined, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CLINICS, () => {
      const clinics = (this.store[STORE_SLICES.CLINICS] || {});
      this.clinicsArray = Object.values(clinics).filter(clinic => !!clinic);
    });

    this.fetchClinics(false);
  }

  private fetchClinics(notify?: boolean): void {
    this.dispatchAction(fetchClinics({ notify }));
  }

  public get shouldEnableNewButton(): boolean {
    return !!this.user.access.createClinic;
  }

  public goToNewClinic(): void {
    this.goTo([createClinicRoute]);
  }

  public viewClinic(clinicId: string): void {
    this.goTo([viewClinicRoute(clinicId)]);
  }
}
