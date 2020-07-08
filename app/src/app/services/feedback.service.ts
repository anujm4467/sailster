import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  FEEDBACK_PROPS,
  IFeedback,
} from '../../../../api/src/shared/feedback/feedback.interface';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly API_URL = '/api/feedback';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public submitFeedback(feedback: IFeedback): Observable<IFeedback> {
    return this.http
      .post<IFeedback>(this.API_URL, feedback);
  }

  public fetchFeedbacksForSail(sailId: string): Observable<IFeedback[]> {
    return this.http
      .get<IFeedback[]>(`${this.API_URL}?${FEEDBACK_PROPS.FEEDBACK_FOR}=${sailId}`);
  }
}
