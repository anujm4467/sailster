import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { IPosition } from '../../../../api/src/shared/sail-path/position.interface';
import { ISailPath } from '../../../../api/src/shared/sail-path/sail-path.interface';

@Injectable({
  providedIn: 'root'
})
export class SailPathService {

  private API_URL = '/api/sail-paths';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public fetchSailPathsForSail(sailId: string): Observable<ISailPath[]> {
    return this.http.get<ISailPath[]>(`${this.API_URL}?sail=${sailId}`);
  }

  public fetchSailPath(sailPathId: string): Observable<ISailPath> {
    return this.http.get<ISailPath>(`${this.API_URL}/${sailPathId}`);
  }

  public createSailPath(sailPath: ISailPath): Observable<ISailPath> {
    return this.http.post<ISailPath>(this.API_URL, sailPath);
  }

  public updateSailPath(sailPathId: string, sailPath: ISailPath): Observable<ISailPath> {
    return this.http.patch<ISailPath>(`${this.API_URL}/${sailPathId}`, sailPath);
  }

  public addSailPathPositions(sailPathId: string, positions: IPosition[]): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${sailPathId}/add-positions`, positions);
  }
}
