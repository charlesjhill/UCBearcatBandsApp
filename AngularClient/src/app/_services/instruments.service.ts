import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, iif, of, from } from 'rxjs';
import { tap, mergeMap, map, reduce } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Instrument, Student } from '../_models';
import { LockerService } from '../_services';
import { produce } from 'immer';

@Injectable({ providedIn: 'root' })
export class InstrumentsService {

  constructor(private http: HttpClient, private lockerService: LockerService) {
    this.currentInstrumentsSubject = new BehaviorSubject([]);
    this.currentInstruments$ = this.currentInstrumentsSubject.asObservable();
    this.update();
  }

  private currentInstrumentsSubject: BehaviorSubject<Instrument[]>;
  public currentInstruments$: Observable<Instrument[]>;

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
    // .pipe(
    //   mergeMap(insts => from(insts).pipe(
    //     mergeMap(inst => iif(
    //       () => !!inst.locker,
    //       this.lockerService.getLocker(inst.locker).pipe(
    //         map(locker => {
    //           inst.locker = locker;
    //           return inst;
    //         })
    //       ),
    //       of(inst)
    //     )),
    //   )),
    //   reduce((acc, v) => {
    //     acc.push(v);
    //     return acc;
    //   }, ([] as Instrument[]))
    // );
  }

  /** Add an instrument, yielding the new instrument AND updating the store */
  public addInstrument(instrument: Instrument): Observable<Instrument> {
    return this.http.post<Instrument>(`${environment.apiUrl}/instruments/`, instrument)
      .pipe(
        // As it stands, we don't expect an instrument to have a locker instance attached when it is first created
        tap(newInst => this.replaceOrAddInstrumentFromStore(newInst)),
      );
  }

  /** Delete an instrument */
  public deleteInstrument(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/instruments/${id}/`)
      .pipe(
        tap(inst => this.deleteInstrumentFromStore(inst)),
      );
  }

  /** Update an instrument */
  public updateInstrument(instrument: Instrument, id?: number): Observable<Instrument> {
    return this.http.put<Instrument>(`${environment.apiUrl}/instruments/${id ?? instrument.id}/`, instrument)
      .pipe(
        tap(() => this.fetchInstrument(id ?? instrument.id))
      );
  }

  /**
   * Fetch a single instrument, updating currentInstruments$
   * @param id The id of the instrument
   */
  public fetchInstrument(id: number): void {
    this.http.get<Instrument>(`${environment.apiUrl}/instruments/${id}/`).pipe(
      // mergeMap(inst => iif(
      //   () => !!inst.locker,
      //   this.lockerService.getLocker(inst.locker).pipe(
      //     map(locker => {
      //       inst.locker = locker;
      //       return inst;
      //     })
      //   ),
      //   of(inst))
      // )
    ).subscribe(inst => this.replaceOrAddInstrumentFromStore(inst));
  }

  /** Get the students assigned to a particular instrument */
  public getStudentsAssigned(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/instruments/${id}/students`);
  }
}
