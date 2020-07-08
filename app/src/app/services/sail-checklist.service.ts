import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { ISailChecklist } from '../../../../api/src/shared/sail-checklist/sail-checklist.interface';

@Injectable({
  providedIn: 'root'
})
export class SailChecklistService {

  private readonly API_URL = '/api/checklists';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public fetchOne(id: string): Observable<ISailChecklist> {
    return this.http.get<ISailChecklist>(`${this.API_URL}/${id}`);
  }

  public find(query: string): Observable<ISailChecklist[]> {
    return this.http.get<ISailChecklist[]>(`${this.API_URL}?${query}`);
  }

  public update(id: string, checklist: ISailChecklist): Observable<ISailChecklist> {
    return this.http.patch<ISailChecklist>(`${this.API_URL}/${id}`, checklist);
  }

  public create(checklist: ISailChecklist): Observable<ISailChecklist> {
    return this.http.post<ISailChecklist>(`${this.API_URL}`, checklist);
  }

}
