import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  IPerson,
  PERSON_TYPE,
} from '../../../../../api/src/shared/sail-checklist/person.interface';

@Component({
  selector: 'app-manifest-view',
  templateUrl: './manifest-view.component.html',
  styleUrls: ['./manifest-view.component.css']
})
export class ManifestViewComponent {

  @Input() peopleManifest: IPerson[] = [];
  @Output() openProfileDialog: EventEmitter<string> = new EventEmitter<string>();
  public PersonType = PERSON_TYPE;

  public showProfileDialog(profileId: string): void {
    this.openProfileDialog.emit(profileId);
  }

}
