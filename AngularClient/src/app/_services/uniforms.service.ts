import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Student, Uniform } from '../_models';

@Injectable({ providedIn: 'root' })
export class UniformsService {

  constructor(private http: HttpClient) {
    this.currentUniformsSubject = new BehaviorSubject([]);
    this.currentUniforms$ = this.currentUniformsSubject.asObservable();
    this.update();
  }

  private currentUniformsSubject: BehaviorSubject<Uniform[]>;
  public currentUniforms$: Observable<Uniform[]>;

  /** Get all the uniforms */
  private list(): Observable<Uniform[]> {
    return this.http.get<Uniform[]>(`${environment.apiUrl}/uniforms/`);
  }

  /** Force an update of the stored uniforms */
  public update(): void {
    console.log('updating list of uniforms');
    this.list().subscribe(data => {
      this.currentUniformsSubject.next(data);
    });
  }

  /** Add a uniform to the data store */
  public addUniform(uniform: Uniform): Observable<Uniform> {
    return this.http.post<Uniform>(`${environment.apiUrl}/uniforms/`, uniform)
      .pipe(
        tap(() => this.update())
      );
  }

  /** Delete a uniform with a given id */
  public deleteUniform(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/uniforms/${id}/`)
      .pipe(
        tap(() => this.update())
      );
  }

  /** Update a uniform with a given id */
  public updateUniform(uniform: Uniform, id: number): Observable<Uniform> {
    return this.http.put<Uniform>(`${environment.apiUrl}/uniforms/` + id + '/', uniform)
      .pipe(
        tap(() => this.update()),
      );
  }

  /** Get the students assigned to a uniform with the given id */
  public getStudentsAssigned(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/uniforms/${id}/students/`);
  }
}
