import { BILGE_STATE } from '../../../../../api/src/shared/sail-checklist/bilge-states';
import { Component, Input } from '@angular/core';
import { FIRE_EXTINGUISHER_STATE } from '../../../../../api/src/shared/sail-checklist/fire-extinguisher-states';
import { FLARES_STATE } from '../../../../../api/src/shared/sail-checklist/flare-states';
import { FUEL_LEVEL } from '../../../../../api/src/shared/sail-checklist/fuel-levels';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checklist-form',
  templateUrl: './checklist-form.component.html',
  styleUrls: ['./checklist-form.component.css']
})
export class ChecklistFormComponent {

  @Input() form: FormGroup;
  @Input() when: string;
  public bilgeState = BILGE_STATE;
  public fireExtinguisherState = FIRE_EXTINGUISHER_STATE;
  public flaresState = FLARES_STATE;
  public fuelLevel = FUEL_LEVEL;

}
