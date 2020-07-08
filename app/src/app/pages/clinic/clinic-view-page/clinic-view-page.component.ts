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
import {
  CLINIC_PROPS,
  IClinic,
} from '../../../../../../api/src/shared/clinic/clinic.interface';
import {
  editClinicEnrollmentRoute,
  editClinicRoute,
} from '../../../routes/routes';
import {
  enrollInClinic,
  graduateUserFromClinic,
  leaveClinic,
  removeUserFromClinic,
} from '../../../store/actions/clinic.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-clinic-view-page',
  templateUrl: './clinic-view-page.component.html',
  styleUrls: ['./clinic-view-page.component.css']
})
export class ClinicViewPageComponent extends BasePageComponent implements OnInit {

  public ClinicProps = CLINIC_PROPS;
  public clinic: IClinic;
  public clinicId: string;

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

    this.clinicId = this.route.snapshot.params.clinicId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CLINICS, () => {
      this.clinic = (this.store[STORE_SLICES.CLINICS] || {})[this.clinicId];

      if (this.clinicId && this.clinic === undefined) {
        this.clinic = this.getClinic(this.clinicId);
      }
    });
  }

  public get shouldEnableEditButton(): boolean {
    return !!this.user.access.editClinic || this.user.profile.id === this.clinic.instructor;
  }

  public editClinic(): void {
    this.goTo([editClinicRoute(this.clinicId)]);
  }

  public get shouldEnableEnrollButton(): boolean {
    return !(this.clinic.enrolledUsers || []).includes(this.user.profile.id);
  }

  public enrollInClinic(): void {
    this.dispatchAction(enrollInClinic({ clinicId: this.clinicId, profileId: this.user.profile.id, notify: true }));
  }

  public disenrollFromClinic(): void {
    this.dispatchAction(leaveClinic({ clinicId: this.clinicId, profileId: this.user.profile.id, notify: true }));
  }

  public get shouldEnableDisenrollButton(): boolean {
    return (this.clinic.enrolledUsers || []).includes(this.user.profile.id);
  }

  public removeUserFromClinic(profileId: string): void {
    this.dispatchAction(removeUserFromClinic({ profileId, clinicId: this.clinicId, notify: true }));
  }

  public graduateUserFromClinic(profileId: string): void {
    this.dispatchAction(graduateUserFromClinic({ profileId, clinicId: this.clinicId, notify: true }));
  }

  public get shouldEnableEditEnrollmentButton(): boolean {
    return !!this.user.access.editClinic || this.user.profile.id === this.clinic.instructor;
  }

  public editEnrollment(): void {
    this.goTo([editClinicEnrollmentRoute(this.clinicId)]);
  }

  public get shouldEnableGraduateButton(): boolean {
    return this.clinic.instructor === this.user.profile.id;
  }

  public get shouldEnableRemoveButton(): boolean {
    return !!this.user.access.editClinic || this.clinic.instructor === this.user.profile.id;
  }

}
