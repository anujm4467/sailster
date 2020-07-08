import { Component, Input } from '@angular/core';
import { IInstruction } from '../../../../../api/src/shared/instructions/instruction.interface';

@Component({
  selector: 'app-instructions-list',
  templateUrl: './instructions-list.component.html',
  styleUrls: ['./instructions-list.component.css']
})
export class InstructionsListComponent {

  @Input() title: string;
  @Input() instructions: IInstruction[] = [];

}
