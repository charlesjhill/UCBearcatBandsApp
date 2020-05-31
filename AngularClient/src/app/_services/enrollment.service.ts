import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Enrollment, PostEnrollment, Instrument, Uniform } from '../_models';
import { EntityService } from './entity.service';

@Injectable({ providedIn: 'root' })
export class EnrollmentService extends EntityService<Enrollment> {
  
  protected getApiUrl(): string {
    return `${environment.apiUrl}/enrollments/`;
  }

  constructor(protected http: HttpClient) {
    super(http);
    this.fetchAll();
  }

  public getAsset(id: number): Observable<Instrument | Uniform> {
    return this.http.get<Instrument | Uniform>(`${environment.apiUrl}/assets/${id}/`);
  }
}
