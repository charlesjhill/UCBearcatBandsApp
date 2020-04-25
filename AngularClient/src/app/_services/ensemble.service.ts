import { Ensemble } from '../_models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EnsembleService {

  constructor(private http: HttpClient) {
    this.currentEnsemblesSubject = new BehaviorSubject([]);
    this.currentEnsembles = this.currentEnsemblesSubject.asObservable();
    this.update();
  }

  private baseURL = `${environment.apiUrl}/ensembles/`;
  private currentEnsemblesSubject: BehaviorSubject<Ensemble[]>;
  public currentEnsembles: Observable<Ensemble[]>;

  /** Get all the ensembles from the server */
  private list(): Observable<Ensemble[]> {
    return this.http.get<Ensemble[]>(this.baseURL).pipe(first());
  }

  /** Force a refresh of the stored ensembles */
  public update(): void {
    this.list().subscribe(data => {
      this.currentEnsemblesSubject.next(data);
    });
  }

  /** Add an ensemble */
  public add(ensemble: { name: string; term: string; is_active: boolean }): Observable<Ensemble> {
    return this.http.post<Ensemble>(this.baseURL, ensemble).pipe(
      first(),
      tap(() => this.update())
    );
  }

  /** Delete an ensemble */
  public delete(id: number): Observable<any> {
    return this.http.delete<any>(this.baseURL + id + '/').pipe(
      first(),
      tap(() => this.update())
    );
  }

  public getEnsemble(id: number): Observable<Ensemble> {
    return this.http.get<Ensemble>(this.baseURL + id + '/').pipe(
      first()
    );
  }
}
