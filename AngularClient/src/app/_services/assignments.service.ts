import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Assignment } from '../_models';

@Injectable({ providedIn: 'root' })
export class AssignmentService {

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

  /** Get all the assignments from the API */
  list(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${environment.apiUrl}/assignments/`)
      .pipe(catchError(this.handleError));
  }

  /** Add an assignment to the API */
  addAssigment(assignment: Assignment): Observable<Assignment> {
    return this.http.post<Assignment>(`${environment.apiUrl}/assignments/`, assignment)
      .pipe(catchError(this.handleError));
  }

  /** Delete an assignment from the API */
  deleteAssigment(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/assignments/${id}/`)
      .pipe(catchError(this.handleError));
  }

  /** Update an assignment object */
  updateAssigment(assignment: Assignment, id: number): Observable<Assignment> {
    return this.http.put<Assignment>(`${environment.apiUrl}/assigments/${id}/`, assignment)
      .pipe(catchError(this.handleError));
  }
}
