import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Enrollment, PostEnrollment, Instrument, Uniform } from '../_models';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {

  constructor(private http: HttpClient) { }

  /** List all enrollments */
  public list(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${environment.apiUrl}/enrollments/`);
  }

  /** Add an enrollment */
  public addEnrollment(enrollment: PostEnrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${environment.apiUrl}/enrollments/`, enrollment);
  }

  /** Delete an enrollment */
  public deleteEnrollment(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/enrollments/${id}/`);
  }

  /** Update an enrollment */
  public updateEnrollment(enrollment: Enrollment, id: number): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${environment.apiUrl}/enrollments/${id}/`, enrollment);
  }

  /** Get a single enrollment */
  public getEnrollment(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${environment.apiUrl}/enrollments/${id}/`);
  }

  public getAsset(id: number): Observable<Instrument | Uniform> {
    return this.http.get<Instrument | Uniform>(`${environment.apiUrl}/assets/${id}/`);
  }
}
