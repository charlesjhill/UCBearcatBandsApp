import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import produce from 'immer';
import { tap, map, filter } from 'rxjs/operators';
import { isEqual } from 'lodash';


export interface Keyable {
  id: number;
}

/**
 * A base class for Services with the prebaked CRUD behavior
 */
export abstract class EntityService<T extends Keyable> {

  /** The base API url. Set at construct time */
  protected readonly baseUrl: string;
  protected entitiesSubject: BehaviorSubject<T[]>;
  protected entities$: Observable<T[]>;

  constructor(protected http: HttpClient) {
    this.entitiesSubject = new BehaviorSubject([]);
    this.entities$ = this.entitiesSubject.asObservable();
    this.baseUrl = this.getApiUrl();
  }

  /**
   *  Get the "base" API url
   *  @example
   *  apiUrl = getApiUrl();
   *  // apiUrl = "localhost:8000/api/v1/lockers/"
   */
  protected abstract getApiUrl(): string;

  protected replaceOrAddToStore(entity: T): void {
    const ind = this.entitiesSubject.value.findIndex(e => e.id === entity.id);
    if (ind === -1 || !isEqual(this.entitiesSubject.value[ind], entity)) {
      // draft is of type Draft<T>[], which we cannot push a T to, unfortunately
      const nextState = produce(this.entitiesSubject.value, (draft: any) => {
        if (ind === -1) {
          draft.push(entity);
        } else {
          draft[ind] = entity;
        }
      });
      this.entitiesSubject.next(nextState);
    }
  }

  protected deleteFromStore(entity: T): void {
    if (!entity) { return; }
    const nextState = produce(this.entitiesSubject.value, draft => {
      const index = draft.findIndex(i => i.id === entity.id);
      if (index !== -1) {
        draft.splice(index);
      }
    });

    this.entitiesSubject.next(nextState);
  }

  /** Force a refresh of stored entities */
  public fetchAll(): void {
    this.http.get<T[]>(this.baseUrl).subscribe(data => {
      this.entitiesSubject.next(data);
    });
  }

  /**
   * Fetch a single entity, updating the store
   * @param id The id of the entity
   */
  public fetch(id: number): void {
    this.http.get<T>(this.baseUrl + `${id}/`)
      .subscribe(entity => {
        this.replaceOrAddToStore(entity);
      });
  }

  //#region CRUD

  /**
   * Add an entity the store, yielding the new instance
   * @param entity The entity to add
   */
  public add(entity: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, entity).pipe(
      tap(ent => this.replaceOrAddToStore(ent))
    );
  }

  /** Get a single entity. Can emit many times. Will not emit falsy values.  */
  public get(id: number): Observable<T> {
    this.fetch(id);
    return this.entities$.pipe(
      map(entities => entities.find(i => i.id === id)),
      filter(ent => !!ent)
    );
  }

  /** Get all entities. May emit multiple times. */
  public getAll(): Observable<T[]> {
    this.fetchAll();
    return this.entities$;
  }

  /** PUT a new entity. Will return the newly updated entity. */
  public update(entity: T): Observable<T> {
    return this.http.put<T>(this.baseUrl + `${entity.id}/`, entity)
      .pipe(
        tap(ent => this.replaceOrAddToStore(ent))
      );
  }

  /** DELETE a given entity */
  public delete(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + `${id}/`)
      .pipe(
        tap(ent => this.deleteFromStore(ent))
      );
  }

  //#endregion


}
