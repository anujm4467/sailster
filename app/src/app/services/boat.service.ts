import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { IBoat } from '../../../../api/src/shared/boat/boat.interface';

@Injectable({
  providedIn: 'root'
})
export class BoatService {

  private readonly API_URL = '/api/boats';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  fetchOne(id: string): Observable<IBoat> {
    return this.http.get<IBoat>(`${this.API_URL}/${id}`);
  }

  fetchAll(): Observable<IBoat[]> {
    return this.http.get<IBoat[]>(this.API_URL);
  }

  findByName(name: string): Observable<IBoat[]> {
    return this.http.get<IBoat[]>(`${this.API_URL}/?substring=${name}&fields=name`);
  }

  update(id: string, boat: IBoat): Observable<IBoat> {
    return this.http.patch<IBoat>(`${this.API_URL}/${id}`, boat);
  }

  create(boat: IBoat): Observable<IBoat> {
    return this.http.post<IBoat>(`${this.API_URL}`, boat);
  }
}
