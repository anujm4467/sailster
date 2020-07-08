import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { INSTRUCTIONS } from '../../../../api/src/shared/instructions/instructions';
import { IInstructions } from '../../../../api/src/shared/instructions/instructions.interface';

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {

  private readonly API_URL = '/api/instructions';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public createInstructions(instructions: IInstructions): Observable<IInstructions> {
    return this.http.post<IInstructions>(`${this.API_URL}`, instructions);
  }

  public updateInstructions(id: string, instructions: IInstructions): Observable<IInstructions> {
    return this.http.patch<IInstructions>(`${this.API_URL}/${id}`, instructions);
  }

  public fetchInstructionsByBoat(boatId: string): Observable<IInstructions[]> {
    return this.http.get<IInstructions[]>(`${this.API_URL}?boatId=${boatId}`);
  }

  public fetchInstructionsByType(boatId: string, instructionsType: INSTRUCTIONS): Observable<IInstructions[]> {
    return this.http.get<IInstructions[]>(`${this.API_URL}?boatId=${boatId}&instructionType=${instructionsType}`);
  }

}
