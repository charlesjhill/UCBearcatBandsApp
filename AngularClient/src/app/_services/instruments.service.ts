import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Instrument, Student } from '../_models';

@Injectable({ providedIn: 'root' })
export class InstrumentsService {

  constructor(private http: HttpClient) {
    this.currentInstrumentsSubject = new BehaviorSubject([]);
    this.currentInstruments = this.currentInstrumentsSubject.asObservable();
    this.update();
  }

  private currentInstrumentsSubject: BehaviorSubject<Instrument[]>;
  public currentInstruments: Observable<Instrument[]>;

  /** Force a refresh of stored instruments */
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

  /** Get all the instruments from the server */
  private list(): Observable<Instrument[]> {
    return this.http.get<Instrument[]>(`${environment.apiUrl}/instruments/`).pipe(first());
  }

  /** Add an instrument */
  public addInstrument(instrument: Instrument): Observable<Instrument> {
    return this.http.post<Instrument>(`${environment.apiUrl}/instruments/`, instrument)
      .pipe(
        first(),
        tap(() => this.update()),
        catchError(err => this.handleError(err))
      );
  }

  /** Delete an instrument */
  public deleteInstrument(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/instruments/` + id + '/')
      .pipe(
        first(),
        tap(() => this.update()),
        catchError(err => this.handleError(err))
      );
  }

  // TODO: We can just use an instrument object, since it contains the id
  /** Update an instrument */
  public updateInstrument(instrument: Instrument, id: number): Observable<Instrument> {
    return this.http.put<Instrument>(`${environment.apiUrl}/instruments/` + id + '/', instrument)
      .pipe(
        first(),
        tap(() => this.update()),
        catchError(err => this.handleError(err)));
  }

  /** Get the students assigned to a particular instrument */
  public getStudentsAssigned(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/instruments/${id}/students`).pipe(first(), catchError(this.handleError));
  }
}
