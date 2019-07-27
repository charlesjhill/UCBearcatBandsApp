import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, RegisterUser, TokenReturn } from '../_models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


export interface Student {
  user: User;
  m_number: string;
  enrollments: any[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    register(user: RegisterUser): Observable<TokenReturn> {
        return this.http.post<TokenReturn>(`${environment.apiUrl}/rest-auth/registration/`, user);
    }

    update(user: User): Observable<User> {
        return this.http.put<User>(`${environment.apiUrl}/rest-auth/user/`, user);
  }

  list(): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/students/`);
  }
}
