import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
//import 'rxjs/add/operator/mapTo';

export interface Instrument {
  kind: string;
  make: string;
  model: string;
  serial_number: string;
  uc_tag_number: string;
  uc_asset_number: string;
  condition: string;
}

@Injectable({ providedIn: 'root' })
export class InstrumentsService {

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
  list(): Observable<Instrument[]> {
    return this.__http.get<Instrument[]>(`${environment.apiUrl}/instruments/`);
  }

  addInstrument (instrument: Instrument): Observable<Instrument> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })};
    return this.__http.post<Instrument>(`${environment.apiUrl}/instruments/`, instrument, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteInstrument(id): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.__http.delete(`${environment.apiUrl}/instruments/` + id + '/')
      .pipe(catchError(this.handleError));
  }

  updateInstrument(instrument: Instrument, id): Observable<Instrument> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.__http.put<Instrument>(`${environment.apiUrl}/instruments/`+ id + '/', instrument, httpOptions)
      .pipe(catchError(this.handleError));
  }
}
