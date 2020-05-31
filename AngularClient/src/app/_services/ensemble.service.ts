import { Ensemble } from '../_models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class EnsembleService extends EntityService<Ensemble> {

  protected getApiUrl() { return `${environment.apiUrl}/ensembles/`; }

  constructor(protected http: HttpClient) {
    super(http);
    this.fetchAll();
  }

}
