import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { IUserAccess } from '../../../../api/src/shared/user-access/user-access.interface';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {

  private readonly API_URL = '/api/user-access';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public getUserAccess(profileId: string): Observable<IUserAccess> {
    return this.http.get<IUserAccess>(`${this.API_URL}/${profileId}`);
  }

  public updateUserAccess(profileId: string, access: IUserAccess): Observable<IUserAccess> {
    return this.http.patch<IUserAccess>(`${this.API_URL}/${profileId}`, access);
  }
}
