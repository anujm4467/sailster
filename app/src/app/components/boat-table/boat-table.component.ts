import { Component, Input } from '@angular/core';
import { IBoat } from '../../../../../api/src/shared/boat/boat.interface';

@Component({
  selector: 'app-boat-table',
  templateUrl: './boat-table.component.html',
  styleUrls: ['./boat-table.component.css']
})
export class BoatTableComponent {

  @Input() boat: IBoat;
  @Input() showPictures = true;

}
