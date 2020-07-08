import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
} from '@angular/forms';
import {
  IPerson,
  PERSON_TYPE,
} from '../../../../../api/src/shared/sail-checklist/person.interface';

@Component({
  selector: 'app-manifest-edit',
  templateUrl: './manifest-edit.component.html',
  styleUrls: ['./manifest-edit.component.css']
})
export class ManifestEditComponent {

  @Input() showNewGuestForm = false;
  @Input() form: FormGroup;
  @Input() manifestFormControlName: string;
  @Output() newGuestCancelled: EventEmitter<void> = new EventEmitter<void>();
  @Output() newGuestAdded: EventEmitter<IPerson> = new EventEmitter<IPerson>();
  @Output() guestRemoved: EventEmitter<number> = new EventEmitter<number>();
  @Output() openProfileDialog: EventEmitter<string> = new EventEmitter<string>();

  public PersonType = PERSON_TYPE;

  public get manifestControls(): AbstractControl[] {
    return (this.form.get(this.manifestFormControlName) as FormArray).controls;
  }

  public cancelNewGuest(): void {
    this.newGuestCancelled.emit();
  }

  public addNewGuest(name: string, guestOf: string): void {
    this.newGuestAdded.emit({ name, guestOf });
  }

  public removeGuest(index: number): void {
    this.guestRemoved.emit(index);
  }

  public showProfileDialog(profileId: string): void {
    this.openProfileDialog.emit(profileId);
  }

}
