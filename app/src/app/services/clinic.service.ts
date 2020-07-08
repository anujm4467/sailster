import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { IClinic } from '../../../../api/src/shared/clinic/clinic.interface';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  private readonly API_URL = '/api/clinics';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public createClinic(clinic: IClinic): Observable<IClinic> {
    return this.http.post<IClinic>(`${this.API_URL}`, clinic);
  }

  public updateClinic(clinicId: string, clinic: IClinic): Observable<IClinic> {
    return this.http.patch<IClinic>(`${this.API_URL}/${clinicId}`, clinic);
  }

  public enrollInClinic(clinicId: string, profileId: string): Observable<IClinic> {
    return this.http.patch<IClinic>(`${this.API_URL}/${clinicId}/enroll/${profileId}`, undefined);
  }

  public leaveClinic(clinicId: string, profileId: string): Observable<IClinic> {
    return this.http.delete<IClinic>(`${this.API_URL}/${clinicId}/leave/${profileId}`);
  }

  public addUserToClinic(clinicId: string, profileId: string): Observable<IClinic> {
    return this.http.patch<IClinic>(`${this.API_URL}/${clinicId}/add-user/${profileId}`, undefined);
  }

  public graduateUserFromClinic(clinicId: string, profileId: string): Observable<IClinic> {
    return this.http.patch<IClinic>(`${this.API_URL}/${clinicId}/graduate-user/${profileId}`, undefined);
  }

  public removeUserToClinic(clinicId: string, profileId: string): Observable<IClinic> {
    return this.http.delete<IClinic>(`${this.API_URL}/${clinicId}/remove-user/${profileId}`);
  }

  public fetchClinic(clinicId: string): Observable<IClinic> {
    return this.http.get<IClinic>(`${this.API_URL}/${clinicId}`);
  }

  public fetchClinics(query?: string): Observable<IClinic[]> {
    if (query) {
      return this.http.get<IClinic[]>(`${this.API_URL}?${query}`);
    }

    return this.http.get<IClinic[]>(`${this.API_URL}`);
  }
}
