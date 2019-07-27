import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../_models';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) {
    this.currentStudentsSubject = new BehaviorSubject([]);
    this.currentStudents = this.currentStudentsSubject.asObservable();
   }

  private baseUrl = `${environment.apiUrl}/students/`;
  private currentStudentsSubject: BehaviorSubject<Student[]>;
  public currentStudents: Observable<Student[]>;

  private list(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl).pipe(first());
  }

  public details(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}/`);
  }

  /**
   * Refresh the students
   */
  public update(): void {
    console.log('updating list of students');
    this.list().subscribe(data => {
      this.currentStudentsSubject.next(data);
    });
  }
}
