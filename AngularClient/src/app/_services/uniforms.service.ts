import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
//import 'rxjs/add/operator/mapTo';

export interface Uniform {
  kind: string;
  condition: string;
  size: string;
  number: string;
}

@Injectable({ providedIn: 'root' })
export class UniformsService {

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

  // Uses http.get() to Load data from single API endpoint
  list(): Observable<Uniform[]> {
    return this.__http.get<Uniform[]>(`${environment.apiUrl}/uniforms/`);
  }

  addUniform(uniform: Uniform): Observable<Uniform> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.__http.post<Uniform>(`${environment.apiUrl}/uniforms/`, uniform, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteUniform(id): Observable<any> {
    return this.__http.delete(`${environment.apiUrl}/uniforms/` + id + '/')
      .pipe(catchError(this.handleError));
  }

  updateUniform(uniform: Uniform, id): Observable<Uniform> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.__http.put<Uniform>(`${environment.apiUrl}/uniforms/` + id + '/', uniform, httpOptions)
      .pipe(catchError(this.handleError));
  }
}
