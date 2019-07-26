import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.apiUrl}/students/`;

  list(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  details(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}/`);
  }
}
