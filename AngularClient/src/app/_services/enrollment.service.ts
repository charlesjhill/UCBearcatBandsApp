import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Enrollment } from '../_models';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {

  constructor(private __http: HttpClient, private _userService: UserService) { }

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
  };

  //Lists assignments
  list(): Observable<Enrollment[]> {
    return this.__http.get<Enrollment[]>(`${environment.apiUrl}/enrollments/`);
  }

  //Creates assignments
  addEnrollment(enrollment: Enrollment): Observable<Enrollment> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.__http.post<Enrollment>(`${environment.apiUrl}/enrollments/`, enrollment, httpOptions)
      .pipe(catchError(this.handleError));
  }

  //Deletes assignments
  deleteEnrollment(id): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.__http.delete(`${environment.apiUrl}/enrollments/` + id + '/')
      .pipe(catchError(this.handleError));
  }

  //updates assignments
  updateEnrollment(enrollment: Enrollment, id): Observable<Enrollment> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.__http.put<Enrollment>(`${environment.apiUrl}/enrollments/` + id + '/', enrollment, httpOptions)
      .pipe(catchError(this.handleError));
  }
}
