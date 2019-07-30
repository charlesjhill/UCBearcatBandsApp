import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Uniform, Student } from '../_models';

@Injectable({ providedIn: 'root' })
export class UniformsService {

  constructor(private __http: HttpClient) {
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

  // Uses http.get() to Load data from single API endpoint
  private list(): Observable<Uniform[]> {
    return this.__http.get<Uniform[]>(`${environment.apiUrl}/uniforms/`).pipe(first());
  }

  public update(): void {
    console.log('updating list of instruments');
    this.list().subscribe(data => {
      this.currentUniformsSubject.next(data);
    });
  }

  addUniform(uniform: Uniform): Observable<Uniform> {
    return this.__http.post<Uniform>(`${environment.apiUrl}/uniforms/`, uniform)
      .pipe(
        first(),
        map(u => {
          this.update();
          return u;
        }),
        catchError(this.handleError));
  }

  deleteUniform(id: number): Observable<any> {
    return this.__http.delete(`${environment.apiUrl}/uniforms/` + id + '/')
      .pipe(
        first(),
        map(u => {
          this.update();
          return u;
        }),
        catchError(this.handleError));
  }

  updateUniform(uniform: Uniform, id: number): Observable<Uniform> {
    return this.__http.put<Uniform>(`${environment.apiUrl}/uniforms/` + id + '/', uniform)
      .pipe(
        first(),
        map(u => {
          this.update();
          return u;
        }),
        catchError(this.handleError));
  }

  public getStudentsAssigned(id: number): Observable<Student[]> {
    return this.__http.get<Student[]>(`${environment.apiUrl}/uniforms/` + id + '/students/').pipe(first(), catchError(this.handleError));
  }
}
