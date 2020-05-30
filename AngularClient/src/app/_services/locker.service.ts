import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Locker } from '../_models';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import produce from 'immer';

@Injectable({
  providedIn: 'root'
})
export class LockerService {

  private currentLockersSubject: BehaviorSubject<Locker[]>;
  public currentLockers$: Observable<Locker[]>;

  constructor(private http: HttpClient) {
    this.currentLockersSubject = new BehaviorSubject([]);
    this.currentLockers$ = this.currentLockersSubject.asObservable();
  }

  private readonly baseUrl = `${environment.apiUrl}/lockers/`;

  private replaceOrAddFromStore(newItem: Locker) {
    const nextState = produce(this.currentLockersSubject.value, draft => {
      const index = draft.findIndex(v => v.id === newItem.id);
      if (index === -1) {
        draft.push(newItem);
      } else {
        draft[index] = newItem;
      }
    });
    this.currentLockersSubject.next(nextState);
  }

  public fetch(id: number): void {
    this.http.get<Locker>(`${this.baseUrl}${id}/`)
      .subscribe(inst => this.replaceOrAddFromStore(inst));
  }

  public getLocker(id: number): Observable<Locker> {
    this.fetch(id);
    return this.currentLockers$.pipe(
      map(lockers => lockers.find(l => l.id === id))
    );
  }

}
