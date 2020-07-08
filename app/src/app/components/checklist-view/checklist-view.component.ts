import { Component, Input } from '@angular/core';
import { IChecklist } from '../../../../../api/src/shared/sail-checklist/checklist.interface';

@Component({
  selector: 'app-checklist-view',
  styleUrls: ['./checklist-view.component.css'],
  templateUrl: './checklist-view.component.html',
})
export class ChecklistViewComponent {

  @Input() checklist: IChecklist;

}
