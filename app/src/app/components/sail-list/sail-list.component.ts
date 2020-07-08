import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { IBoat } from '../../../../../api/src/shared/boat/boat.interface';
import { ISail } from '../../../../../api/src/shared/sail/sail.interface';
import { IBoatMap } from '../../models/boat-state.interface';
import { MomentService } from '../../services/moment.service';

@Component({
  selector: 'app-sail-list',
  styleUrls: ['./sail-list.component.css'],
  templateUrl: './sail-list.component.html',
})
export class SailListComponent {

  @Input() public boats: IBoatMap = {} as IBoatMap;
  @Input() public emptyMessage: string;
  @Input() public sails: ISail[] = [];
  @Input() public title: string;
  @Input() public isLoading: boolean;
  @Output() public boatFetcher: EventEmitter<string> = new EventEmitter();
  @Output() public clicked: EventEmitter<ISail> = new EventEmitter();
  @Output() public refreshRequest: EventEmitter<void> = new EventEmitter();

  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }

  public generateSailDiscription(sail: ISail): string {
    const duration = this.duration(sail.start, sail.end);
    const boat = this.getBoatName(sail);
    const start = this.humanizeDateWithTime(sail.start);
    const name = sail.name;

    const description = `
    Sail details:
    ${name}: ${duration} sail on board of ${boat} on ${start}.
    Click to go to this sail.`;

    return description;
  }

  public duration(start: string | Date, finish: string | Date): string {
    return this.momentService.duration(start, finish);
  }

  public humanizeDateWithTime(date) {
    return this.momentService.humanizeDateWithTime(date, false);
  }

  public clickSail(sail: ISail) {
    this.clicked.emit(sail);
  }

  public refresh() {
    this.refreshRequest.emit();
  }

  public getBoatName(sail: ISail): string {
    const boat = this.getBoat(sail);

    if (!boat) {
      return 'n/a';
    }

    return boat.name;
  }
  public getBoat(sail: ISail): IBoat {
    const boatId = sail.boat;

    if (!boatId) {
      return undefined;
    }

    const boat = this.boats[boatId];

    if (boat === undefined) {
      this.boatFetcher.emit(boatId);
    }

    return boat;
  }

}
