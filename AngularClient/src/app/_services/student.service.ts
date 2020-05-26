import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) {
    this.currentStudentsSubject = new BehaviorSubject([]);
    this.currentStudents$ = this.currentStudentsSubject.asObservable();
   }

  private readonly baseUrl = `${environment.apiUrl}/students/`;
  private currentStudentsSubject: BehaviorSubject<Student[]>;
  public currentStudents$: Observable<Student[]>;

  /** Get the list of all the students */
  public list(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  /** Get a student instance given an id */
  public details(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}${id}/`);
  }

  /** Force a refresh of the stored students */
  public update(): void {
    console.log('updating list of students');
    this.list().subscribe(data => {
      this.currentStudentsSubject.next(data);
    });
  }
}
