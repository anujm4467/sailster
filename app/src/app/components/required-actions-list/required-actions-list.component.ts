import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IRequiredAction } from '../../../../../api/src/shared/required-action/required-action.interface';
import { REQUIRED_ACTIONS } from '../../../../../api/src/shared/required-action/required-action.types';

@Component({
  selector: 'app-required-actions-list',
  templateUrl: './required-actions-list.component.html',
  styleUrls: ['./required-actions-list.component.css']
})
export class RequiredActionsListComponent {

  @Input() actions: IRequiredAction[] = [];
  @Input() title = 'Required Actions:';
  @Output() actionClick: EventEmitter<IRequiredAction> = new EventEmitter<IRequiredAction>();

  public actionIcon(actionType: REQUIRED_ACTIONS): string {
    switch (actionType) {
      case REQUIRED_ACTIONS.REVIEW_NEW_PROFILE:
        return 'person_add';
      case REQUIRED_ACTIONS.RATE_SAIL:
        return 'stars';
      case REQUIRED_ACTIONS.CONFIRM_SAIL_ATTENDACE:
        return 'thumbs_up_down';
      default:
        return 'notification_important';
    }
  }

  public clicked(action: IRequiredAction): void {
    this.actionClick.emit(action);
  }
}
