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

@Component({
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.css']
})
export class ImageFormComponent {

  @Input() allowComments = true;
  @Input() controlArrayName: string;
  @Input() form: FormGroup;
  @Input() allowDelete = true;
  @Output() deleteClick: EventEmitter<number> = new EventEmitter<number>();

  public deleteImage(index: number): void {
    this.deleteClick.emit(index);
  }

  public get controlsArray(): AbstractControl[] {
    return (this.form.get(this.controlArrayName) as FormArray).controls;
  }

}
