import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Locker } from '../_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LockerService {

  constructor(private http: HttpClient) { }

  private readonly baseUrl = `${environment.apiUrl}/lockers/`;

  getLocker(id: number): Observable<Locker> {
    return this.http.get<Locker>(this.baseUrl + id + '/');
  }

}
