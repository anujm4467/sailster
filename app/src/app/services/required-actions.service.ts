import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRequiredAction, REQUIRED_ACTION_PROPS } from '../../../../api/src/shared/required-action/required-action.interface';
import { REQUIRED_ACTION_STATE } from '../../../../api/src/shared/required-action/required-action.state';

@Injectable({
  providedIn: 'root'
})
export class RequiredActionsService {

  private readonly API_URL = '/api/required-actions';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public fetchNewRequiredActionsForUser(userId: string): Observable<IRequiredAction[]> {
    return this.http
    .get<IRequiredAction[]>(
      `${this.API_URL}?${REQUIRED_ACTION_PROPS.ASSIGNED_TO}=${userId}&${REQUIRED_ACTION_PROPS.STATE}=${REQUIRED_ACTION_STATE.NEW}&limit=3&sort=+dueDate`);
  }

  public completeRequiredAction(actionId: string): Observable<IRequiredAction> {
    return this.http
      .patch<IRequiredAction>(`${this.API_URL}/${actionId}`, {
        [REQUIRED_ACTION_PROPS.STATE]: REQUIRED_ACTION_STATE.COMPLETED,
      });
  }

  public dismissRequiredAction(actionId: string): Observable<IRequiredAction> {
    return this.http
      .patch<IRequiredAction>(`${this.API_URL}/${actionId}`, {
        [REQUIRED_ACTION_PROPS.STATE]: REQUIRED_ACTION_STATE.DISMISSED,
      });
  }
}
