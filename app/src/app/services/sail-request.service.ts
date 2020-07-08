import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { ISailRequest } from '../../../../api/src/shared/sail-request/sail-request.interface';

@Injectable({
  providedIn: 'root'
})
export class SailRequestService {

  private readonly API_URL = '/api/sail-requests';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public fetchOne(id: string): Observable<ISailRequest> {
    return this.http.get<ISailRequest>(`${this.API_URL}/${id}`);
  }

  public fetchAll(query?: string): Observable<ISailRequest[]> {
    if (query) {
      let completeQuery = query;

      if (query.charAt(0) !== '?') {
        completeQuery = `?${query}`;
      }

      return this.http.get<ISailRequest[]>(`${this.API_URL}${completeQuery}`);
    }

    return this.http.get<ISailRequest[]>(`${this.API_URL}`);
  }

  public find(query: string): Observable<ISailRequest[]> {
    return this.http.get<ISailRequest[]>(`${this.API_URL}/?${query}`);
  }

  public update(id: string, sailRequest: ISailRequest): Observable<ISailRequest> {
    return this.http.patch<ISailRequest>(`${this.API_URL}/${id}`, sailRequest);
  }

  public create(sailRequest: ISailRequest): Observable<ISailRequest> {
    return this.http.post<ISailRequest>(`${this.API_URL}`, sailRequest);
  }

}
