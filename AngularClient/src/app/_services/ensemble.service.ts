import { Ensemble } from '../_models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnsembleService {

  constructor(private http: HttpClient) { }

  private baseURL = `${environment.apiUrl}/ensembles/`;

  list(): Observable<Ensemble[]> {
    return this.http.get<Ensemble[]>(this.baseURL);
  }

  getEnsemble(id): Observable<Ensemble> {
    return this.http.get<Ensemble>(this.baseURL + id + '/');
  }
}
