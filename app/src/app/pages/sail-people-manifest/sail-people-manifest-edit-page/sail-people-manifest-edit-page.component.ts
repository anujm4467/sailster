import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import {
  IPerson,
  PERSON_TYPE,
} from '../../../../../../api/src/shared/sail-checklist/person.interface';
import { ISailChecklist } from '../../../../../../api/src/shared/sail-checklist/sail-checklist.interface';
import { ISail } from '../../../../../../api/src/shared/sail/sail.interface';
import { updateSailChecklist } from '../../../store/actions/sail-checklist.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-people-manifest-edit-page',
  templateUrl: './sail-people-manifest-edit-page.component.html',
  styleUrls: ['./sail-people-manifest-edit-page.component.css']
})
export class SailPeopleManifestEditPageComponent extends BasePageComponent implements OnInit {

  public form: FormGroup;
  public checklistId: string;
  public checklist: ISailChecklist;
  public sail: ISail;
  public scheduledPeople: IPerson[] = [];
  public sailManifest: IPerson[] = [];
  public PersonType = PERSON_TYPE;
  public showNewGuestForm = false;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router, dialog);
    this.buildForm();
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.checklistId = this.route.snapshot.params.checklistId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHECKLISTS, () => {
      this.checklist = this.getChecklist(this.checklistId);

      if (this.checklist) {
        this.sailManifest = this.checklist.peopleManifest || [];

        this.sail = this.getSail(this.checklist.sail);

        this.scheduledPeople = [];

        const skipper = this.getProfile(this.sail.skipper);

        this.scheduledPeople.push({
          name: skipper.name,
          profile: skipper.id,
          personType: PERSON_TYPE.SKIPPER,
          present: false,
        });

        const crew = this.getProfile(this.sail.crew);

        this.scheduledPeople.push({
          name: crew.name,
          profile: crew.id,
          personType: PERSON_TYPE.CREW,
          present: false,
        });

        this.scheduledPeople
          .push(
            ...this.sail.passengers
              .map(
                (pass) => {
                  const passenger = this.getProfile(pass);

                  return {
                    name: passenger.name,
                    profile: passenger.id,
                    personType: PERSON_TYPE.PASSENGER,
                    present: false,
                  };
                }
              )
          );

      }

      this.scheduledPeople = this.scheduledPeople
        .filter(person => !(this.sailManifest || []).find(man => man.profile === person.profile));

      this.updateForm(this.sailManifest.concat(this.scheduledPeople));
    });
  }

  public get shouldEnableSubmitButton(): boolean {
    return !!this.form && this.form.dirty;
  }

  public submitManifest(): void {
    const manifest = this.form.value.peopleManifest;

    this.dispatchAction(updateSailChecklist({ id: this.checklistId, checklist: { peopleManifest: manifest } }));
  }

  public get manifestControls(): AbstractControl[] {
    return (this.form.controls.peopleManifest as FormArray).controls;
  }

  public addGuest(): void {
    this.showNewGuestForm = true;
  }

  public cancelNewGuest(): void {
    this.showNewGuestForm = false;
  }

  public removeGuest(index: number): void {
    const formManifest = this.form.controls.peopleManifest as FormArray;

    formManifest.removeAt(index);

    formManifest.updateValueAndValidity();
    formManifest.markAsDirty();

    this.form.updateValueAndValidity();
  }

  public addNewGuest(guest: IPerson): void {
    const formManifest = this.form.controls.peopleManifest as FormArray;

    formManifest.push(this.fb.group({
      guestOf: this.fb.control(guest.guestOf, Validators.required),
      name: this.fb.control(guest.name, Validators.required),
      personType: this.fb.control(PERSON_TYPE.GUEST),
      present: this.fb.control(false),
      profile: this.fb.control(undefined),
    }));

    formManifest.updateValueAndValidity();
    formManifest.markAsDirty();

    this.form.updateValueAndValidity();

    this.showNewGuestForm = false;
  }

  private updateForm(manifest: IPerson[]): void {

    const formManifest = this.form.controls.peopleManifest as FormArray;

    formManifest.clear();
    manifest.forEach(man => formManifest.push(this.fb.group({
      guestOf: this.fb.control(man.guestOf),
      name: this.fb.control(man.name),
      personType: this.fb.control(man.personType),
      present: this.fb.control(man.present || false),
      profile: this.fb.control(man.profile),
    })));

    this.form.updateValueAndValidity();
    this.form.markAsPristine();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      peopleManifest: this.fb.array([]),
    });
  }

}
