import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Uniform, Student } from '../_models';

@Injectable({ providedIn: 'root' })
export class UniformsService {

  constructor(private http: HttpClient) {
    this.currentUniformsSubject = new BehaviorSubject([]);
    this.currentUniforms = this.currentUniformsSubject.asObservable();
    this.update();
  }

  private currentUniformsSubject: BehaviorSubject<Uniform[]>;
  public currentUniforms: Observable<Uniform[]>;

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  /** Get all the uniforms */
  private list(): Observable<Uniform[]> {
    return this.http.get<Uniform[]>(`${environment.apiUrl}/uniforms/`).pipe(first());
  }

  /** Force an update of the stored instruments */
  public update(): void {
    console.log('updating list of instruments');
    this.list().subscribe(data => {
      this.currentUniformsSubject.next(data);
    });
  }

  /** Add a uniform to the data store */
  public addUniform(uniform: Uniform): Observable<Uniform> {
    return this.http.post<Uniform>(`${environment.apiUrl}/uniforms/`, uniform)
      .pipe(
        first(),
        tap(this.update),
        catchError(this.handleError)
      );
  }

  /** Delete a uniform with a given id */
  public deleteUniform(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/uniforms/${id}/`)
      .pipe(
        first(),
        tap(this.update),
        catchError(this.handleError));
  }

  /** Update a uniform with a given id */
  public updateUniform(uniform: Uniform, id: number): Observable<Uniform> {
    return this.http.put<Uniform>(`${environment.apiUrl}/uniforms/` + id + '/', uniform)
      .pipe(
        first(),
        tap(this.update),
        catchError(this.handleError)
      );
  }

  /** Get the students assigned to a uniform with the given id */
  public getStudentsAssigned(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/uniforms/${id}/students/`).pipe(first(), catchError(this.handleError));
  }
}
