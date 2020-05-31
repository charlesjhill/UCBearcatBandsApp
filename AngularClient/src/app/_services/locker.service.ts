import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Locker } from '../_models';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class LockerService extends EntityService<Locker> {

  protected getApiUrl(): string {
    return `${environment.apiUrl}/lockers/`;
  }

  constructor(protected http: HttpClient) {
    super(http);
  }
}
