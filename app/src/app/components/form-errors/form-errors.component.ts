import {
  Component,
  Input,
} from '@angular/core';
import {
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.css']
})
export class FormErrorsComponent {

  @Input() form: FormGroup;

  public formValidationErrors(form: FormGroup): { control: string, message: string }[] {

    const result = [];
    Object
      .keys(form.controls)
      .forEach((key) => {
        const formProperty = form.get(key);
        if (formProperty instanceof FormGroup) {
          result.push(...this.formValidationErrors(formProperty));
        } else if (formProperty instanceof FormArray) {
          const array = formProperty as FormArray;
          array.controls.forEach(cont => result.push(...this.formValidationErrors(cont as FormGroup)));
        }
        const controlErrors: ValidationErrors = form.get(key).errors || {};

        Object
          .keys(controlErrors)
          .forEach((keyError) => {
            result.push({
              control: key,
              message: keyError,
              value: controlErrors[keyError]
            });
          });
      });

    return result;
  }

}
