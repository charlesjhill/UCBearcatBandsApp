import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
//import 'rxjs/add/operator/mapTo';

export interface Instrument {
  kind: string;
  make: string;
  model: string;
  serial_number: string;
  uc_tag_number: string;
  uc_asset_number: string;
  condition: string;
}

@Injectable({ providedIn: 'root' })
export class InstrumentsService {

  constructor(private __http: HttpClient, private _userService: UserService) { }

  // Uses http.get() to Load data from single API endpoint
  list(): Observable<Instrument[]> {
    return this.__http.get<Instrument[]>(`${environment.apiUrl}/instruments/`);
  }

  // send  a POST request to the API to create a new instrument
  //create(post, token) {
    //httpOptions = {
      //headers: new HttpHeaders({
        //'Content-Type': 'application/json',
        //'Authorization': 'JWT' + this._userService.token //this is our token from user service
      //})
    //};
    //return this.http.post('/api/v1/instruments', JSON.stringify(post), httpOptions);
  //}
}
