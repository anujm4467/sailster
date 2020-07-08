import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { PROFILE_ROLES } from '../../../../api/src/shared/profile/profile-roles.enum';
import {
  IProfile,
  PROFILE_PROPS,
} from '../../../../api/src/shared/profile/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly API_URL = '/api/profiles';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  fetchTotalProfileCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/count`);
  }

  fetchProfiles(query: string): Observable<IProfile[]> {
    return this.http.get<IProfile[]>(`${this.API_URL}?${query}`);
  }

  fetchOne(id: string): Observable<IProfile> {
    return this.http.get<IProfile>(`${this.API_URL}/${id}`);
  }

  fetchSkippers(): Observable<IProfile[]> {
    return this.http.get<IProfile[]>(`${this.API_URL}?${PROFILE_PROPS.ROLES}=${PROFILE_ROLES.SKIPPER}`);
  }

  fetchProfileBatch(ids: string[]): Observable<IProfile[]> {
    const query = ids.map(id => `_id=${id}`).join('&');
    return this.http.get<IProfile[]>(`${this.API_URL}?${query}`);
  }

  fetchCrew(): Observable<IProfile[]> {
    return this.http.get<IProfile[]>(`${this.API_URL}?${PROFILE_PROPS.ROLES}=${PROFILE_ROLES.CREW}`);
  }

  fetchMembers(): Observable<IProfile[]> {
    return this.http.get<IProfile[]>(`${this.API_URL}?${PROFILE_PROPS.ROLES}=${PROFILE_ROLES.MEMBER}`);
  }

  updateInfo(id: string, profile: IProfile): Observable<IProfile> {
    return this.http.patch<IProfile>(`${this.API_URL}/update-info/${id}`, profile);
  }

  updateAccess(id: string, profile: IProfile): Observable<IProfile> {
    return this.http.patch<IProfile>(`${this.API_URL}/update-access/${id}`, profile);
  }

  searchByName(name: string, limit?: number): Observable<IProfile[]> {
    if (limit) {
      return this.http.get<IProfile[]>(`${this.API_URL}?substring=${name}&fields=${PROFILE_PROPS.NAME}&limit=${limit}`);
    }
    return this.http.get<IProfile[]>(`${this.API_URL}?substring=${name}&fields=${PROFILE_PROPS.NAME}`);
  }

  searchByNameOrEmail(name: string, limit?: number): Observable<IProfile[]> {
    if (limit) {
      return this.http
        .get<IProfile[]>(`${this.API_URL}?substring=${name}&fields=${PROFILE_PROPS.NAME}&fields=${PROFILE_PROPS.EMAIL}&limit=${limit}`);
    }
    return this.http.get<IProfile[]>(`${this.API_URL}?substring=${name}&fields=${PROFILE_PROPS.NAME}&fields=${PROFILE_PROPS.EMAIL}`);
  }
}
