import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  IBoatMaintenance,
} from '../../../../api/src/shared/maintenance/maintenance.interface';
import { IComment } from '../../../../api/src/shared/comment/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class BoatMaintenanceService {

  private readonly API_URL = '/api/boat-maintenance';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  postMaintenanceComment(id: string, comment: IComment): Observable<IBoatMaintenance> {
    return this.http.post<IBoatMaintenance>(`${this.API_URL}/${id}/comment`, comment);
  }

  fetchMaintenanceRequests(query: string): Observable<IBoatMaintenance[]> {
    return this.http.get<IBoatMaintenance[]>(`${this.API_URL}?${query}`);
  }

  fetchOne(id: string): Observable<IBoatMaintenance> {
    return this.http.get<IBoatMaintenance>(`${this.API_URL}/${id}`);
  }

  updateMaintenanceRequest(id: string, maintenance: IBoatMaintenance): Observable<IBoatMaintenance> {
    return this.http.patch<IBoatMaintenance>(`${this.API_URL}/${id}`, maintenance);
  }

  createMaintenaceRequest(maintenance: IBoatMaintenance): Observable<IBoatMaintenance> {
    return this.http.post<IBoatMaintenance>(this.API_URL, maintenance);
  }

}
