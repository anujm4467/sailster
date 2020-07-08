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
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { INSTRUCTION_PROPS } from '../../../../../../api/src/shared/instructions/instruction.interface';
import { MEDIA_PROPS } from '../../../../../../api/src/shared/media/media.interface';
import {
  deleteFile,
  uploadDepartureInstructionsPicture,
} from '../../../store/actions/cdn.actions';
import { updateInstructions } from '../../../store/actions/instructions.actions';
import { STORE_SLICES } from '../../../store/store';
import { BoatInstructionsBasePageComponent } from '../boat-instructions-base-page/boat-instructions-base-page.component';

@Component({
  selector: 'app-boat-instructions-edit-page',
  templateUrl: './boat-instructions-edit-page.component.html',
  styleUrls: ['./boat-instructions-edit-page.component.css']
})
export class BoatInstructionsEditPageComponent extends BoatInstructionsBasePageComponent implements OnInit {

  public departureInstructionsForm: FormGroup;
  public arrivalInstructionsForm: FormGroup;
  public savingForm = false;

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
    super.ngOnInit();

    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CDN);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.INSTRUCTIONS, () => {
      if (this.departure) {
        this.updateForm(this.departure, undefined);
        this.savingForm = false;
      }

      if (this.arrival) {
        this.updateForm(undefined, this.arrival);
        this.savingForm = false;
      }
    });
  }

  private updateForm(departure, arrival): void {
    if (departure) {
      const departures = this.departureInstructionsForm.controls.instructions as FormArray;

      while (departures.length) {
        departures.removeAt(0);
      }

      (departure.instructions || []).forEach(inst => departures.push(this.fb.group({
        [INSTRUCTION_PROPS.INSTRUCTION]: this.fb.control(inst.instruction, Validators.required),
        [INSTRUCTION_PROPS.TITLE]: this.fb.control(inst.title, Validators.required),
        [INSTRUCTION_PROPS.PICTURES]: this.fb.array((inst.pictures || []).map(pic => this.fb.group({
          [MEDIA_PROPS.COMMENT]: pic.comment,
          [MEDIA_PROPS.URL]: pic.url,
        }))),

      })));

      this.departureInstructionsForm.updateValueAndValidity();
      this.departureInstructionsForm.markAsUntouched();
      this.departureInstructionsForm.markAsPristine();
    }

    if (arrival) {
      const arrivals = this.arrivalInstructionsForm.controls.instructions as FormArray;

      while (arrivals.length) {
        arrivals.removeAt(0);
      }

      (arrival.instructions || []).forEach(inst => arrivals.push(this.fb.group({
        [INSTRUCTION_PROPS.INSTRUCTION]: inst.instruction,
        [INSTRUCTION_PROPS.TITLE]: inst.title,
        [INSTRUCTION_PROPS.PICTURES]: this.fb.array((inst.pictures || []).map(pic => this.fb.group({
          [MEDIA_PROPS.COMMENT]: pic.comment,
          [MEDIA_PROPS.URL]: pic.url,
        }))),

      })));

      this.arrivalInstructionsForm.updateValueAndValidity();
      this.arrivalInstructionsForm.markAsUntouched();
      this.arrivalInstructionsForm.markAsPristine();
    }
  }

  public get title(): string {
    return `Edit Boat Instructions Form for ${this.boatName}`;
  }

  private buildForm(): void {
    this.departureInstructionsForm = this.fb.group({
      instructions: this.fb.array([]),
    });
    this.arrivalInstructionsForm = this.fb.group({
      instructions: this.fb.array([]),
    });
  }

  private createNewInstruction(): FormGroup {
    return this.fb.group({
      [INSTRUCTION_PROPS.TITLE]: this.fb.control(undefined, Validators.required),
      [INSTRUCTION_PROPS.INSTRUCTION]: this.fb.control(undefined, Validators.required),
      [INSTRUCTION_PROPS.PICTURES]: this.fb.array([]),
    });
  }

  public addDepartureInstruction(): void {
    const newInstruction = this.createNewInstruction();
    (this.departureInstructionsForm.controls.instructions as FormArray).push(newInstruction);
    this.departureInstructionsForm.markAsDirty();
    this.departureInstructionsForm.updateValueAndValidity();
  }

  public addArrivalInstruction(): void {
    const newInstruction = this.createNewInstruction();
    (this.arrivalInstructionsForm.controls.instructions as FormArray).push(newInstruction);
    this.arrivalInstructionsForm.markAsDirty();
    this.arrivalInstructionsForm.updateValueAndValidity();
  }

  public get departureInstructionsControls(): AbstractControl[] {
    return (this.departureInstructionsForm.controls.instructions as FormArray).controls;
  }

  public get arrivalInstructionsControls(): AbstractControl[] {
    return (this.arrivalInstructionsForm.controls.instructions as FormArray).controls;
  }

  public deleteFile(filePath: string): void {
    this.dispatchAction(deleteFile({ filePath, notify: true }));
  }

  public uploadDepartureInstructionsPictureToCDN(file: File): void {
    this.dispatchAction(uploadDepartureInstructionsPicture({ file, boatId: this.boatId, notify: true }));
  }

  public uploadArrivalInstructionsPictureToCDN(file: File): void {
    this.dispatchAction(uploadDepartureInstructionsPicture({ file, boatId: this.boatId, notify: true }));
  }

  public get shouldEnableSaveButton(): boolean {
    const depInstructions = this.departureInstructionsForm.controls.instructions.dirty
      && this.departureInstructionsForm.controls.instructions.valid;

    const ariInstructions = this.arrivalInstructionsForm.controls.instructions.dirty
      && this.arrivalInstructionsForm.controls.instructions.valid;

    const should = !this.savingForm
      && (depInstructions || ariInstructions);
    return should;
  }

  public submitForm(): void {
    if (this.departureInstructionsForm.controls.instructions.dirty) {
      const instructions = this.departureInstructionsForm.controls.instructions.value;
      const id = this.departure.id;
      this.dispatchAction(updateInstructions({ id, instructions: { instructions }, notify: true }));
      this.savingForm = true;
    }

    if (this.arrivalInstructionsForm.controls.instructions.dirty) {
      const instructions = this.arrivalInstructionsForm.controls.instructions.value;
      const id = this.arrival.id;
      this.dispatchAction(updateInstructions({ id, instructions: { instructions }, notify: true }));
      this.savingForm = true;
    }
  }
}
