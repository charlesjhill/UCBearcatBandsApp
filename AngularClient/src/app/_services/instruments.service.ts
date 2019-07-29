import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Instrument, Student, Ensemble } from '../_models';

@Injectable({ providedIn: 'root' })
export class InstrumentsService {

  constructor(private __http: HttpClient) {
    this.currentInstrumentsSubject = new BehaviorSubject([]);
    this.currentInstruments = this.currentInstrumentsSubject.asObservable();
    this.update();
  }

  private currentInstrumentsSubject: BehaviorSubject<Instrument[]>;
  public currentInstruments: Observable<Instrument[]>;

  public update(): void {
    console.log('updating list of instruments');
    this.list().subscribe(data => {
      this.currentInstrumentsSubject.next(data);
    });
  }

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

  private list(): Observable<Instrument[]> {
    return this.__http.get<Instrument[]>(`${environment.apiUrl}/instruments/`).pipe(first());
  }

  public addInstrument(instrument: Instrument): Observable<Instrument> {
    return this.__http.post<Instrument>(`${environment.apiUrl}/instruments/`, instrument)
      .pipe(
        first(),
        map(i => {
          this.update();
          return i;
        }),
        catchError(this.handleError),
      );
  }

  public deleteInstrument(id: number): Observable<any> {
    return this.__http.delete(`${environment.apiUrl}/instruments/` + id + '/')
      .pipe(
        first(),
        map(x => {
          this.update();
          return x;
        }),
        catchError(this.handleError)
      );
  }

  // TODO: We can just use an instrument object, since it contains the id
  public updateInstrument(instrument: Instrument, id: number): Observable<Instrument> {
    return this.__http.put<Instrument>(`${environment.apiUrl}/instruments/` + id + '/', instrument)
      .pipe(
        first(),
        map(x => {
          this.update();
          return x;
        }),
        catchError(this.handleError));
  }

  public getStudentsAssigned(id: number): Observable<Student[]> {
    return this.__http.get<Student[]>(`${environment.apiUrl}/instruments/` + id + '/students/').pipe(first(), catchError(this.handleError));
  }
}
