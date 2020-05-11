import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assignment } from '../_models';

@Injectable({ providedIn: 'root' })
export class AssignmentService {

  readonly assignmentsURL = `${environment.apiUrl}/assignments/`;

  constructor(private http: HttpClient) { }

  /** Get all the assignments from the API */
  list(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.assignmentsURL);
  }

  /** Add an assignment to the API */
  addAssigment(assignment: Assignment): Observable<Assignment> {
    return this.http.post<Assignment>(this.assignmentsURL, assignment);
  }

  /** Delete an assignment from the API */
  deleteAssigment(id: number): Observable<any> {
    return this.http.delete(this.assignmentsURL + id + '/');
  }

  /** Update an assignment object */
  updateAssigment(assignment: Assignment, id: number): Observable<Assignment> {
    return this.http.put<Assignment>(this.assignmentsURL + id + '/', assignment);
  }
}
