import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { IBoat } from '../../../../api/src/shared/boat/boat.interface';
import { IComment } from '../../../../api/src/shared/comment/comment.interface';
import { IProfile } from '../../../../api/src/shared/profile/profile.interface';
import { ISail } from '../../../../api/src/shared/sail/sail.interface';

@Injectable({
  providedIn: 'root'
})
export class SailService {

  private readonly API_URL = '/api/sails';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public postNewComment(sailId: string, comment: IComment): Observable<ISail> {
    return this.http.post<ISail>(`${this.API_URL}/${sailId}/comment`, comment);
  }

  public startSail(id: string): Observable<ISail> {
    return this.http.post<ISail>(`${this.API_URL}/start/${id}`, null);
  }

  public completeSail(id: string): Observable<ISail> {
    return this.http.post<ISail>(`${this.API_URL}/complete/${id}`, null);
  }

  public cancelSail(id: string, sail: ISail): Observable<ISail> {
    return this.http.post<ISail>(`${this.API_URL}/cancel/${id}`, sail);
  }

  public fetchAvailableSkippers(startDate: string|Date, endDate: string|Date): Observable<IProfile[]> {
    return this.http.get<IProfile[]>(`${this.API_URL}/available-skippers?start=${startDate}&end=${endDate}`);
  }

  public fetchAvailableCrew(startDate: string|Date, endDate: string|Date): Observable<IProfile[]> {
    return this.http.get<IProfile[]>(`${this.API_URL}/available-crew?start=${startDate}&end=${endDate}`);
  }

  public fetchAvailableMembers(startDate: string|Date, endDate: string|Date): Observable<IProfile[]> {
    return this.http.get<IProfile[]>(`${this.API_URL}/available-members?start=${startDate}&end=${endDate}`);
  }

  public fetchAvailableBoats(startDate: string|Date, endDate: string|Date): Observable<IBoat[]> {
    return this.http.get<IBoat[]>(`${this.API_URL}/available-boats?start=${startDate}&end=${endDate}`);
  }

  public fetchPastSailsForAll(query?: string): Observable<ISail[]> {
    if (query) {
      return this.http.get<ISail[]>(`${this.API_URL}/past?${query}`);
    }

    return this.http.get<ISail[]>(`${this.API_URL}/past`);
  }

  public fetchPastSailsForUser(userId: string, query?: string): Observable<ISail[]> {
    if (query) {
      return this.http.get<ISail[]>(`${this.API_URL}/past?${query}&userId=${userId}`);
    }

    return this.http.get<ISail[]>(`${this.API_URL}/past?userId=${userId}`);
  }

  public fetchUpcomingSailsForAll(query?: string): Observable<ISail[]> {
    if (query) {
      return this.http.get<ISail[]>(`${this.API_URL}/upcoming?${query}`);
    }

    return this.http.get<ISail[]>(`${this.API_URL}/upcoming`);
  }

  public fetchUpcomingSailsForUser(userId: string, query?: string): Observable<ISail[]> {
    if (query) {
      return this.http.get<ISail[]>(`${this.API_URL}/upcoming?${query}&userId=${userId}`);
    }

    return this.http.get<ISail[]>(`${this.API_URL}/upcoming?userId=${userId}`);
  }

  public fetchOne(id: string): Observable<ISail> {
    return this.http.get<ISail>(`${this.API_URL}/${id}`);
  }

  public count(query?: string): Observable<number> {
    if (query) {
      return this.http.get<number>(`${this.API_URL}/count?${query}`);
    }

    return this.http.get<number>(`${this.API_URL}/count`);
  }

  public countUserSail(userId: string, query?: string): Observable<number> {
    if (query) {
      return this.http.get<number>(`${this.API_URL}/count-user-sails/${userId}?${query}`);
    }

    return this.http.get<number>(`${this.API_URL}/count-user-sails/${userId}`);
  }

  public fetchUserSail(userId: string, query?: string): Observable<ISail[]> {
    if (query) {
      return this.http.get<ISail[]>(`${this.API_URL}/user-sails/${userId}?${query}`);
    }

    return this.http.get<ISail[]>(`${this.API_URL}/user-sails/${userId}`);
  }

  public fetchAll(query?: string): Observable<ISail[]> {
    if (query) {
      return this.http.get<ISail[]>(`${this.API_URL}${query}`);
    }

    return this.http.get<ISail[]>(`${this.API_URL}`);
  }

  public findByName(name: string): Observable<ISail[]> {
    return this.http.get<ISail[]>(`${this.API_URL}/?substring=${name}&fields=name`);
  }

  public search(query: string): Observable<ISail[]> {
    return this.http.get<ISail[]>(`${this.API_URL}/search?${query}`);
  }

  public update(id: string, sail: ISail): Observable<ISail> {
    return this.http.patch<ISail>(`${this.API_URL}/${id}`, sail);
  }

  public create(sail: ISail): Observable<ISail> {
    return this.http.post<ISail>(`${this.API_URL}`, sail);
  }

  public joinAsCrew(sailId: string): Observable<ISail> {
    return this.joinSail('crew', sailId);
  }

  public joinAsPassenger(sailId: string): Observable<ISail> {
    return this.joinSail('passenger', sailId);
  }

  public joinAsSkipper(sailId: string): Observable<ISail> {
    return this.joinSail('skipper', sailId);
  }

  public leaveSail(sailId: string): Observable<ISail> {
    return this.http.post<ISail>(`${this.API_URL}/${sailId}/leave`, null);
  }

  private joinSail(as: string, sailId: string): Observable<ISail> {
    return this.http.post<ISail>(`${this.API_URL}/${sailId}/join/${as}`, null);
  }
}
