import { Ensemble } from '../_models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EnsembleService {

  constructor(private http: HttpClient) {
    this.currentEnsemblesSubject = new BehaviorSubject([]);
    this.currentEnsembles = this.currentEnsemblesSubject.asObservable();
  }

  private baseURL = `${environment.apiUrl}/ensembles/`;
  private currentEnsemblesSubject: BehaviorSubject<Ensemble[]>;
  public currentEnsembles: Observable<Ensemble[]>;

  private list(): Observable<Ensemble[]> {
    return this.http.get<Ensemble[]>(this.baseURL).pipe(first());
  }

  public update(): void {
    console.log('updating list of ensembles');
    this.list().subscribe(data => {
      this.currentEnsemblesSubject.next(data);
    });
  }

  add(ensemble: { name: string; term: string; is_active: boolean }): Observable<Ensemble> {
    return this.http.post<Ensemble>(this.baseURL, ensemble).pipe(
      first(),
      map(ens => {
        this.update();
        return ens;
      })
    );
  }

  delete(id: number): Observable<any> {
    console.log('Pre delete call');
    return this.http.delete<any>(this.baseURL + id + '/').pipe(
      first(),
      map(result => {
        console.log('post delete call');
        this.update();
        return result;
      })
    );
  }
}
