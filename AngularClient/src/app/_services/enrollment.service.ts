import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Enrollment, PostEnrollment } from '../_models';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  /** List all enrollments */
  public list(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${environment.apiUrl}/enrollments/`);
  }

  /** Add an enrollment */
  public addEnrollment(enrollment: PostEnrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${environment.apiUrl}/enrollments/`, enrollment)
      .pipe(catchError(this.handleError));
  }

  /** Delete an enrollment */
  public deleteEnrollment(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/enrollments/${id}/`)
      .pipe(catchError(this.handleError));
  }

  /** Update an enrollment */
  public updateEnrollment(enrollment: Enrollment, id: number): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${environment.apiUrl}/enrollments/${id}/`, enrollment)
      .pipe(catchError(this.handleError));
  }

  /** Get a single enrollment */
  public getEnrollment(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${environment.apiUrl}/enrollments/${id}/`)
      .pipe(catchError(this.handleError));
  }
}
