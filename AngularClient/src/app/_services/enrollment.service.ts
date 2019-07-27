import { Instrument } from './instruments.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class PostEnrollment {
  ensemble: number;
  student: number;
}

export class Enrollment {
  id: number;
  ensemble: number;
  student: number;
  assets: any[];
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private http: HttpClient) { }

  private url = `${environment.apiUrl}/enrollments/`;

  addEnrollment(enrollment: PostEnrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.url, enrollment).pipe(first());
  }
}
