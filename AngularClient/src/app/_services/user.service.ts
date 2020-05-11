import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegisterUser, TokenReturn, User } from '../_models';

export interface Student {
  user: User;
  m_number: string;
  enrollments: any[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  /** Register a new user with the server */
  register(user: RegisterUser): Observable<TokenReturn> {
    return this.http.post<TokenReturn>(`${environment.apiUrl}/dj-rest-auth/registration/`, user);
  }

  /** Update a user's information with the server */
  update(user: User): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/dj-rest-auth/user/`, user);
  }
}