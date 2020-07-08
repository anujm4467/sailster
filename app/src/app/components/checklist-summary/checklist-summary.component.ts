import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { ISailChecklist } from '../../../../../api/src/shared/sail-checklist/sail-checklist.interface';
import { ISailMap } from '../../models/sail-state.interface';
import { MomentService } from '../../services/moment.service';

@Component({
  selector: 'app-checklist-summary',
  templateUrl: './checklist-summary.component.html',
  styleUrls: ['./checklist-summary.component.css']
})
export class ChecklistSummaryComponent {

  @Input() checklist: ISailChecklist;
  @Input() sails: ISailMap;
  @Output() sailFetcher: EventEmitter<string> = new EventEmitter();
  @Output() sailViewer: EventEmitter<string> = new EventEmitter();
  @Output() openProfileDialog: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }

  public formatDate(date: Date | string): string {
    return this.momentService.format(date);
  }

  public viewSail(): void {
    this.sailViewer.emit(this.checklist.sail);
  }

  public get sailName(): string {
    const sail = this.sails[this.checklist.sail];

    if (sail === undefined) {
      this.sailFetcher.emit(this.checklist.sail);
      return '';
    }

    return sail ? sail.name : 'sail no longer exists';
  }

  public showProfileDialog(profileId: string): void {
    this.openProfileDialog.emit(profileId);
  }
}
