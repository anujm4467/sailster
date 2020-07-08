import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IBoat } from '../../../../../api/src/shared/boat/boat.interface';

@Component({
  selector: 'app-boat-list',
  styleUrls: ['./boat-list.component.css'],
  templateUrl: './boat-list.component.html',
})
export class BoatListComponent {

  @Input() public boats: IBoat[];
  @Input() public emptyMessage = 'There are no boats.';
  @Input() public isLoading: boolean;
  @Input() public title: string;
  @Output() public clicked: EventEmitter<IBoat> = new EventEmitter();
  @Output() public refreshRequest: EventEmitter<void> = new EventEmitter();

  public captionActions = [
    {
      name: 'refresh',
      icon: 'refresh',
      tooltip: 'refresh',
    },
  ];

  constructor(
  ) { }

  public generateBoatDiscription(boat: IBoat): string {
    const description = `test ${boat.name}`;

    return description;
  }

  public clickBoat(boat: IBoat) {
    this.clicked.emit(boat);
  }

  public refresh() {
    this.refreshRequest.emit();
  }

}
