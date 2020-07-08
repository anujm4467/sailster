import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import {
  CLINIC_PROPS,
  IClinic,
} from '../../../../../../api/src/shared/clinic/clinic.interface';
import { IProfile } from '../../../../../../api/src/shared/profile/profile.interface';
import { updateClinic } from '../../../store/actions/clinic.actions';
import { searchProfilesByNameOrEmail } from '../../../store/actions/profile.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-clinic-edit-enrollment-page',
  templateUrl: './clinic-edit-enrollment-page.component.html',
  styleUrls: ['./clinic-edit-enrollment-page.component.css']
})
export class ClinicEditEnrollmentPageComponent extends BasePageComponent implements OnInit {

  private profileFilterText = '';
  public ClinicProps = CLINIC_PROPS;
  public clinic: IClinic;
  public clinicId: string;
  public filteredProfiles: IProfile[] = [];
  public form: FormGroup;
  public availableProfiles: IProfile[] = [];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit() {
    this.clinicId = this.route.snapshot.params.clinicId;

    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, () => {
      this.availableProfiles = this.profilesArray;
      this.filterProfiles(this.profileFilterText, false);
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CLINICS, () => {
      this.clinic = (this.store[STORE_SLICES.CLINICS] || {})[this.clinicId];

      if (this.clinicId && this.clinic === undefined) {
        this.clinic = this.getClinic(this.clinicId);
      }

      if (this.clinic) {
        this.updateForm();
        this.filterProfiles(this.profileFilterText, false);
      }
    });
  }

  public profileFilterListener(filter: string): void {
    this.profileFilterText = (filter || '').toLocaleLowerCase();
    this.filterProfiles(filter, true);
  }

  private filterProfiles(filter: string, refetch: boolean = false): void {
    const currentStudents: string[] = this.form.get(CLINIC_PROPS.ENROLLED_USERS).value || [];

    if (!filter) {
      this.filteredProfiles = this.availableProfiles.filter(profile => !currentStudents.includes(profile.id));
    } else {
      if (refetch && filter && filter.length > 3) {
        this.dispatchAction(searchProfilesByNameOrEmail({ text: filter, notify: true }));
      }
      this.filteredProfiles = this.availableProfiles
        .filter(profile => profile.name.toLocaleLowerCase().includes(filter) || profile.email.includes(filter))
        .filter(profile => !currentStudents.includes(profile.id));
    }
  }

  public addStudent(profileId: string): void {
    const currentStudents: string[] = this.form.get(CLINIC_PROPS.ENROLLED_USERS).value;
    if (currentStudents.includes(profileId)) {
      return;
    }

    currentStudents.push(profileId);

    this.form.updateValueAndValidity();
    this.form.markAsDirty();

    this.filterProfiles(this.profileFilterText, false);
  }

  public removeStudent(profileId: string): void {
    const currentStudents: string[] = this.form.get(CLINIC_PROPS.ENROLLED_USERS).value;
    const index = currentStudents.indexOf(profileId);

    if (index === -1) {
      return;
    }

    currentStudents.splice(index, 1);

    this.form.updateValueAndValidity();
    this.form.markAsDirty();

    this.filterProfiles(this.profileFilterText, false);
  }

  private updateForm(): void {
    this.form.patchValue(this.clinic);
    this.form.updateValueAndValidity();
    this.form.markAsPristine();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      [CLINIC_PROPS.ENROLLED_USERS]: [],
    });
  }

  public get shouldEnableSaveButton(): boolean {
    return this.clinicId && this.form && this.form.valid && this.form.dirty;
  }

  public get title(): string {
    return 'Edit Clinic Enrollment Form';
  }

  public saveClinic(): void {
    const clinic: IClinic = this.form.value;

    this.dispatchAction(updateClinic({ clinic, clinicId: this.clinicId, notify: true }));
  }

}
