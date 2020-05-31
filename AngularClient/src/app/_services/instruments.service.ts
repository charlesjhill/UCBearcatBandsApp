import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Instrument, Student } from '../_models';
import { EntityService } from './entity.service';

@Injectable({ providedIn: 'root' })
export class InstrumentsService extends EntityService<Instrument> {

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApiUrl(): string {
    return `${environment.apiUrl}/instruments/`;
  }


  /** Get the students assigned to a particular instrument */
  public getStudentsAssigned(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl + `${id}/students/`);
  }

}
