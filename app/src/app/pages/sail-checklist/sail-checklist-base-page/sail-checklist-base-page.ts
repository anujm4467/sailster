import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { IInstruction } from '../../../../../../api/src/shared/instructions/instruction.interface';
import { INSTRUCTIONS } from '../../../../../../api/src/shared/instructions/instructions';
import { BILGE_STATE } from '../../../../../../api/src/shared/sail-checklist/bilge-states';
import { FIRE_EXTINGUISHER_STATE } from '../../../../../../api/src/shared/sail-checklist/fire-extinguisher-states';
import { FLARES_STATE } from '../../../../../../api/src/shared/sail-checklist/flare-states';
import { FUEL_LEVEL } from '../../../../../../api/src/shared/sail-checklist/fuel-levels';
import {
  IPerson,
  PERSON_TYPE,
} from '../../../../../../api/src/shared/sail-checklist/person.interface';
import { ISailChecklist } from '../../../../../../api/src/shared/sail-checklist/sail-checklist.interface';
import { ISail } from '../../../../../../api/src/shared/sail/sail.interface';
import { InstructionsMap } from '../../../models/instructions-state.interface';
import { viewSailRoute } from '../../../routes/routes';
import {
  fetchSailChecklist,
  updateSailChecklist,
} from '../../../store/actions/sail-checklist.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  template: ''
})
export class SailChecklistBasePageComponent extends BasePageComponent implements OnInit {

  protected checklistId: string;
  public checklistForm: FormGroup;

  constructor(
    store: Store<any>,
    route: ActivatedRoute,
    router: Router,
    private fb?: FormBuilder,
    dialog?: MatDialog,
  ) {
    super(store, route, router, dialog);

    if (fb) {
      this.buildForm();
    }
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.checklistId = this.route.snapshot.params.id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.INSTRUCTIONS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHECKLISTS, () => {

      if (!this.checklist) {
        return;
      }

      const sailManifest = this.checklist.peopleManifest || [];

      const scheduledPeople = [];

      const skipper = this.getProfile(this.sail.skipper);

      scheduledPeople.push({
        name: skipper.name,
        profile: skipper.id,
        personType: PERSON_TYPE.SKIPPER,
        present: false,
      });

      const crew = this.getProfile(this.sail.crew);

      scheduledPeople.push({
        name: crew.name,
        profile: crew.id,
        personType: PERSON_TYPE.CREW,
        present: false,
      });

      scheduledPeople
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
      const notAccountedPeople = scheduledPeople
        .filter(person => !(sailManifest || []).find(man => man.profile === person.profile));

      this.updateForm(this.checklist, sailManifest.concat(notAccountedPeople));

    });
  }

  public get viewSailRouteLink(): string {
    return viewSailRoute(this.sail.id);
  }

  public get boatInstructions(): InstructionsMap {
    const checklist = this.checklist;
    if (!checklist) {
      return {};
    }

    const boatId = checklist.boat;
    const instructions = this.getBoatInstructions(boatId);

    return instructions || {};
  }

  public get departureInstructions(): IInstruction[] {
    const instructions = this.boatInstructions[INSTRUCTIONS.DEPARTURE] || {};
    return instructions.instructions || [];
  }

  public get arrivalInstructions(): IInstruction[] {
    const instructions = this.boatInstructions[INSTRUCTIONS.ARRIVAL] || {};
    return instructions.instructions || [];
  }

  private updateForm(checklist: ISailChecklist, peopleManifest: IPerson[]): void {
    this.checklistForm.patchValue(checklist);

    const formManifest = this.checklistForm.controls.peopleManifest as FormArray;

    formManifest.clear();

    peopleManifest.forEach(man => formManifest.push(this.fb.group({
      guestOf: this.fb.control(man.guestOf),
      name: this.fb.control(man.name),
      personType: this.fb.control(man.personType),
      present: this.fb.control(man.present || false),
      profile: this.fb.control(man.profile),
    })));

    this.checklistForm.markAsUntouched();
    this.checklistForm.markAsPristine();
  }

  public get formBuilder(): FormBuilder {
    return this.fb;
  }

  private buildForm(): void {
    this.checklistForm = this.fb.group({
      sailDestination: new FormControl(undefined, Validators.required),
      weather: new FormControl(undefined, Validators.required),
      instructions: new FormControl(undefined),
      before: this.fb.group({
        bilge: new FormControl(BILGE_STATE.DID_NOT_CHECK),
        comments: new FormControl(),
        extinguisher: new FormControl(FIRE_EXTINGUISHER_STATE.DID_NOT_CHECK),
        flares: new FormControl(FLARES_STATE.DID_NOT_CHECK),
        fuel: new FormControl(FUEL_LEVEL.DID_NOT_CHECK),
        signedByCrew: new FormControl(),
        signedBySkipper: new FormControl(),
      }),
      after: this.fb.group({
        bilge: new FormControl(),
        comments: new FormControl(),
        extinguisher: new FormControl(),
        flares: new FormControl(),
        fuel: new FormControl(),
        signedByCrew: new FormControl(),
        signedBySkipper: new FormControl(),
      }),
      peopleManifest: this.fb.array([]),
    });
  }

  public get checklist(): ISailChecklist {
    const checklist = this.store.checklists.all[this.checklistId];

    if (checklist === undefined && !this._fetching[this.checklistId]) {
      this._fetching[this.checklistId] = true;
      this.dispatchAction(fetchSailChecklist({ id: this.checklistId }));
    }

    if (checklist && this._fetching[this.checklistId]) {
      delete this._fetching[this.checklistId];
    }

    return checklist;
  }

  public get sail(): ISail {
    const id = (this.checklist || {} as ISailChecklist).sail;

    if (!id) {
      return;
    }

    const sail = this.sails[id];

    if (sail === undefined) {
      this.fetchSail(id);
    }

    return sail;
  }

  public get shouldDisableUpdateButton(): boolean {
    const isFormValid = this.checklistForm.valid;
    const should = !isFormValid
      || !this.checklistForm
      || !this.checklistForm.dirty;

    return !!should;
  }

  public save(): void {
    const formControls = this.checklistForm.controls;
    const formKeys = Object.keys(formControls);
    const changedValue = formKeys
      .filter(key => !formControls[key].pristine)
      .reduce(
        (red, key) => {
          const value = formControls[key].value;

          if (typeof value === 'string') {
            red[key] = value.trim();
          } else {
            red[key] = value ? value : null;
          }

          return red;
        },
        {}
      ) as any;
    this.dispatchAction(updateSailChecklist({ id: this.checklistId, checklist: changedValue }));
  }
}
