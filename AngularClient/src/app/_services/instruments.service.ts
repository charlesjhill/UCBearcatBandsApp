import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Instrument, Student } from '../_models';

@Injectable({ providedIn: 'root' })
export class InstrumentsService {

  constructor(private http: HttpClient) {
    this.currentInstrumentsSubject = new BehaviorSubject([]);
    this.currentInstruments$ = this.currentInstrumentsSubject.asObservable();
    this.update();
  }

  private currentInstrumentsSubject: BehaviorSubject<Instrument[]>;
  public currentInstruments$: Observable<Instrument[]>;

  /** Force a refresh of stored instruments */
  public update(): void {
    console.log('updating list of instruments');
    this.list().subscribe(data => {
      this.currentInstrumentsSubject.next(data);
    });
  }

  /** Get all the instruments from the server */
  private list(): Observable<Instrument[]> {
    return this.http.get<Instrument[]>(`${environment.apiUrl}/instruments/`);
  }

  /** Add an instrument */
  public addInstrument(instrument: Instrument): Observable<Instrument> {
    return this.http.post<Instrument>(`${environment.apiUrl}/instruments/`, instrument)
      .pipe(
        tap(() => this.update()),
      );
  }

  /** Delete an instrument */
  public deleteInstrument(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/instruments/${id}/`)
      .pipe(
        tap(() => this.update()),
      );
  }

  // TODO: We can just use an instrument object, since it contains the id
  /** Update an instrument */
  public updateInstrument(instrument: Instrument, id: number): Observable<Instrument> {
    return this.http.put<Instrument>(`${environment.apiUrl}/instruments/${id}/`, instrument)
      .pipe(
        tap(() => this.update())
      );
  }

  public getInstrument(id: number): Observable<Instrument> {
    return this.http.get<Instrument>(`${environment.apiUrl}/instruments/${id}/`);
  }

  /** Get the students assigned to a particular instrument */
  public getStudentsAssigned(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/instruments/${id}/students`);
  }
}
