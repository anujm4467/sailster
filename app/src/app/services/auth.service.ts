import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { IProfile } from '../../../../api/src/shared/profile/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = '/api/auth';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  login(token): Observable<IProfile> {
    return this.http.get<IProfile>(`${this.API_URL}/login`, {
      headers: { authorization: `Bearer ${token}` }
    });
  }

  logout(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/logout`);
  }
}
