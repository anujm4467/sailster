import {
  Component,
  Input,
} from '@angular/core';
import { IPosition } from '../../../../../api/src/shared/sail-path/position.interface';

@Component({
  selector: 'app-position-view',
  templateUrl: './position-view.component.html',
  styleUrls: ['./position-view.component.css']
})
export class PositionViewComponent {

  @Input() position: IPosition;
  @Input() title: string;

}
