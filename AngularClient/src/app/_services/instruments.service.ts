import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { produce } from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Instrument, Student } from '../_models';

@Injectable({ providedIn: 'root' })
export class InstrumentsService {

  constructor(private http: HttpClient) {
    this.currentInstrumentsSubject = new BehaviorSubject([]);
    this.currentInstruments$ = this.currentInstrumentsSubject.asObservable();
    this.fetchAllInstruments();
  }

  private currentInstrumentsSubject: BehaviorSubject<Instrument[]>;
  public currentInstruments$: Observable<Instrument[]>;

  //#region Helper Methods

  /** Replaces an Instrument in the store, or adds one if it doesn't exist */
  private replaceOrAddInstrumentFromStore(newInst: Instrument) {
    const nextState = produce(this.currentInstrumentsSubject.value, draft => {
      const index = draft.findIndex(v => v.id === newInst.id);
      if (index === -1) {
        draft.push(newInst);
      } else {
        draft[index] = newInst;
      }
    });
    this.currentInstrumentsSubject.next(nextState);
  }

  /** Remove an instrument from the store if it exists */
  private deleteInstrumentFromStore(inst: Instrument) {
    const nextState = produce(this.currentInstrumentsSubject.value, draft => {
      const index = draft.findIndex(i => i.id === inst.id);
      if (index !== -1) {
        draft.splice(index);
      }
    });

    this.currentInstrumentsSubject.next(nextState);
  }

  /** Get all the instruments from the server */
  private list(): Observable<Instrument[]> {
    return this.http.get<Instrument[]>(`${environment.apiUrl}/instruments/`);
  }

  //#endregion

  //#region Fetch Methods

  /** Force a refresh of stored instruments */
  public fetchAllInstruments(): void {
    console.log('updating list of instruments');
    this.list().subscribe(data => {
      this.currentInstrumentsSubject.next(data);
    });
  }

  /**
 * Fetch a single instrument, updating currentInstruments$
 * @param id The id of the instrument
 */
  public fetchInstrument(id: number): void {
    this.http.get<Instrument>(`${environment.apiUrl}/instruments/${id}/`)
      .subscribe(inst => this.replaceOrAddInstrumentFromStore(inst));
  }

  //#endregion 

  //#region CRUD operations

  /** Add an instrument, yielding the new instrument AND updating the store */
  public addInstrument(instrument: Instrument): Observable<Instrument> {
    return this.http.post<Instrument>(`${environment.apiUrl}/instruments/`, instrument)
      .pipe(
        // As it stands, we don't expect an instrument to have a locker instance attached when it is first created
        tap(newInst => this.replaceOrAddInstrumentFromStore(newInst)),
      );
  }


  public getInstrument(id: number): Observable<Instrument> {
    return this.currentInstruments$.pipe(
      map(insts => insts.find(i => i.id === id))
    );
  }

  /** Update an instrument */
  public updateInstrument(instrument: Instrument, id?: number): Observable<Instrument> {
    return this.http.put<Instrument>(`${environment.apiUrl}/instruments/${id ?? instrument.id}/`, instrument)
      .pipe(
        tap(inst => this.replaceOrAddInstrumentFromStore(inst))
      );
  }

  /** Delete an instrument */
  public deleteInstrument(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/instruments/${id}/`)
      .pipe(
        tap(inst => this.deleteInstrumentFromStore(inst)),
      );
  }

  //#endregion

  //#region Auxillary Methods

  /** Get the students assigned to a particular instrument */
  public getStudentsAssigned(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/instruments/${id}/students/`);
  }

  //#endregion
}
