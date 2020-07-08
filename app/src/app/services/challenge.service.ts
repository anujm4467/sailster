import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  IChallenge,
  IChallenger,
} from '../../../../api/src/shared/challenge/challenge.interface';
import { IComment } from '../../../../api/src/shared/comment/comment.interface';
import { IMedia } from '../../../../api/src/shared/media/media.interface';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  private readonly API_URL = '/api/challenges';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public fetchChallenges(query: string): Observable<IChallenge[]> {
    if (query) {
      return this.http.get<IChallenge[]>(`${this.API_URL}?${query}`);
    }
    return this.http.get<IChallenge[]>(`${this.API_URL}`);
  }

  public postChallengeComment(challengeId: string, comment: IComment): Observable<IChallenge> {
    return this.http.patch<IChallenge>(`${this.API_URL}/${challengeId}/comment`, comment);
  }

  public deleteChallengePicture(challengeId: string, pictureId: string): Observable<IChallenge> {
    return this.http.delete<IChallenge>(`${this.API_URL}/remove-picture/${challengeId}/${pictureId}`);
  }

  public postChallengePictures(challengeId: string, pictures: IMedia[]): Observable<IChallenge> {
    return this.http.patch<IChallenge>(`${this.API_URL}/add-pictures/${challengeId}`, pictures);
  }

  public fetchChallenge(challengeId: string): Observable<IChallenge> {
    return this.http.get<IChallenge>(`${this.API_URL}/${challengeId}`);
  }

  public createChallenge(challenge: IChallenge): Observable<IChallenge> {
    return this.http.post<IChallenge>(`${this.API_URL}`, challenge);
  }

  public updateChallenge(challengeId: string, challenge: IChallenge): Observable<IChallenge> {
    return this.http.patch<IChallenge>(`${this.API_URL}/${challengeId}`, challenge);
  }

  public completeUserChallenge(challengeId: string, challenger: IChallenger): Observable<IChallenge> {
    return this.http.patch<IChallenge>(`${this.API_URL}/${challengeId}/accomplished-by/${challenger.profile}`, challenger);
  }

  public fetchCount(query?: string): Observable<number> {
    if (query) {
      return this.http.get<number>(`${this.API_URL}/count?${query}`);
    }
    return this.http.get<number>(`${this.API_URL}/count`);
  }

}
