import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { ILog } from '../../../../api/src/shared/log/log.interface';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  private readonly API_URL = '/api/logs';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public fetchLogs(query: string): Observable<ILog[]> {
    return this.http.get<ILog[]>(`${this.API_URL}?${query}`);
  }

  public fetchCount(query?: string): Observable<number> {
    if (query) {
      return this.http.get<number>(`${this.API_URL}/count?${query}`);
    }
    return this.http.get<number>(`${this.API_URL}/count`);
  }

}
