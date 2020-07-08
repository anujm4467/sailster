import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { IMedia } from '../../../../api/src/shared/media/media.interface';
import { ISailPictures } from '../../../../api/src/shared/sail-pictures/sail-pictures.interface';

@Injectable({
  providedIn: 'root'
})
export class SailPicturesService {

  private readonly API_URL = '/api/sail-pictures';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public getPictures(sailId: string): Observable<ISailPictures> {
    return this.http.get<ISailPictures>(`${this.API_URL}/${sailId}`);
  }

  public addNewPictures(sailId: string, pictures: IMedia[]): Observable<ISailPictures> {
    return this.http.patch<ISailPictures>(`${this.API_URL}/${sailId}`, pictures);
  }

  public deletePicture(sailId: string, pictureId: string): Observable<ISailPictures> {
    return this.http.delete<ISailPictures>(`${this.API_URL}/${sailId}/${pictureId}`);
  }

}
