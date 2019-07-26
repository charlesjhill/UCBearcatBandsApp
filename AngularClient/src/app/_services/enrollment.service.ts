import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private http: HttpClient) { }

  private url = `${environment.apiUrl}/enrollments/`;

  addEnrollment(ensembleId: number, studentId: number): Observable<any> {
    const thing = { ensemble: ensembleId, student: studentId };
    return this.http.post<any>(this.url, JSON.stringify(thing)).pipe(first());
  }
}
