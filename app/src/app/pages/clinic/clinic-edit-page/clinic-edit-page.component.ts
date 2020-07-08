import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
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
import { environment } from '../../../../environments/environment';
import { editClinicEnrollmentRoute } from '../../../routes/routes';
import {
  createClinic,
  updateClinic,
} from '../../../store/actions/clinic.actions';
import { searchProfilesByNameOrEmail } from '../../../store/actions/profile.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-clinic-edit-page',
  templateUrl: './clinic-edit-page.component.html',
  styleUrls: ['./clinic-edit-page.component.css']
})
export class ClinicEditPageComponent extends BasePageComponent implements OnInit {

  private instructorFilterText = '';
  public ClinicProps = CLINIC_PROPS;
  public clinic: IClinic;
  public clinicId: string;
  public filteredInstructors: IProfile[] = [];
  public form: FormGroup;
  public instructors: IProfile[] = [];
  public icons: string[] = [];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(HttpClient) private http: HttpClient,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.clinicId = this.route.snapshot.params.clinicId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, () => {
      this.instructors = this.profilesArray;
      this.filterInstructors(this.instructorFilterText, false);
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CLINICS, () => {
      this.clinic = (this.store[STORE_SLICES.CLINICS] || {})[this.clinicId];

      if (this.clinic) {
        this.updateForm();
      }
    });

    this.getIcons();
  }

  public instructorFilterListener(filter: string): void {
    this.instructorFilterText = filter;
    this.filterInstructors(filter, true);
  }

  private getIcons(): void {
    const ICON_LOCATION = environment.production ? 'cdn/list?directory=svg/icons' : 'cdn/list?directory=test/svg/icons';
    this.http
      .get<string[]>(ICON_LOCATION)
      .pipe(
        take(1)
      )
      .subscribe((icons) => {
        this.icons = icons || [];
        this.icons.splice(0, 1);
        this.icons = this.icons
          .filter(icon => icon.toLowerCase().endsWith('.svg'))
          .map(icon => `cdn/files/${icon}`);
      });

  }
  private filterInstructors(filter: string, refetch: boolean = false): void {
    if (!filter) {
      this.filteredInstructors = this.instructors;
    } else {
      if (refetch && filter && filter.length > 3) {
        this.dispatchAction(searchProfilesByNameOrEmail({ text: filter, notify: true }));
      }
      this.filteredInstructors = this.instructors
        .filter(instructor => instructor.name.includes(filter) || instructor.email.includes(filter));
    }
  }

  public get instructorName(): string {
    if (!this.form) {
      return null;
    }

    const instructor = this.form.get(CLINIC_PROPS.INSTRUCTOR).value;

    if (!instructor) {
      return;
    }

    const profile = this.getProfile(instructor);

    return (profile || {}).name;
  }

  public setInstructor(profileId: string): void {
    this.form.get(CLINIC_PROPS.INSTRUCTOR).setValue(profileId);
    this.form.get(CLINIC_PROPS.INSTRUCTOR).markAsDirty();
    this.form.updateValueAndValidity();
    this.form.markAsDirty();
  }

  private updateForm(): void {
    this.form.patchValue(this.clinic);
    this.form.updateValueAndValidity();
    this.form.markAsPristine();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      [CLINIC_PROPS.BADGE]: this.fb.control(null, Validators.required),
      [CLINIC_PROPS.DESCRIPTION]: this.fb.control(undefined, Validators.required),
      [CLINIC_PROPS.INSTRUCTOR]: this.fb.control(null),
      [CLINIC_PROPS.TITLE]: this.fb.control(undefined, Validators.required),
    });
  }

  public get shouldEnableCreateButton(): boolean {
    return !this.clinicId && this.form && this.form.valid && this.form.dirty;
  }

  public get shouldEnableSaveButton(): boolean {
    return this.clinicId && this.form && this.form.valid && this.form.dirty;
  }

  public createClinic(): void {
    const clinic: IClinic = this.form.getRawValue();

    this.dispatchAction(createClinic({ clinic }));
  }

  public get title(): string {
    return this.clinicId ? 'Edit Clinic Form' : 'New Clinic Form';
  }

  public saveClinic(): void {
    const clinic: IClinic = Object
      .keys(this.form.controls)
      .filter(key => this.form.get(key).dirty)
      .reduce(
        (red, key) => {
          red[key] = this.form.get(key).value;
          return red;
        },
        {},
      );

    this.dispatchAction(updateClinic({ clinic, clinicId: this.clinicId, notify: true }));
  }

  public editEnrollment(): void {
    this.goTo([editClinicEnrollmentRoute(this.clinicId)]);
  }

  public get shouldEnableEditButton(): boolean {
    return !!this.clinicId;
  }
}
