import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, Observable, of } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReturnUser, Student, TokenReturn, User } from '../_models';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private currentStudentSubject: BehaviorSubject<Student>;
    public currentStudent: Observable<Student>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();

        this.currentStudentSubject = new BehaviorSubject<Student>(JSON.parse(localStorage.getItem('currentStudent')));
        this.currentStudent = this.currentStudentSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get currentStudentValue(): Student {
        return this.currentStudentSubject.value;
    }

    /** Utility function to convert a token to some returnUser object */
    private tokenToUser(tr: TokenReturn): Observable<{ru: ReturnUser, tr: TokenReturn}> {

        // After the following call, we are going to rely on `jwt.interceptor` to handle setting this header
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Token ${tr.key}`
            })
        };

        // Get the user details (which uses the auth token)
        return this.http.get<ReturnUser>(`${environment.apiUrl}/dj-rest-auth/user/`, httpOptions)
            .pipe(map(ru => ({ ru, tr })));
    }

    /** Convert a returnUser to full user instance (with a token) and perform some side effects 8) */
    private retUserToUser({ ru, tr}: {ru: ReturnUser, tr: TokenReturn}): Observable<User> {
        // Handle the user details, updating our stored 'user' object
        const user = new User();
        user.email = ru.email;
        user.full_name = ru.full_name;
        user.is_student = ru.is_student;
        user.id = ru.id;
        user.token = tr.key;

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);

        return of(user);
    }

    /** Login to the site, receiving an API token if everything is good */
    public login(email: string, password: string) {
        return this.http.post<TokenReturn>(`${environment.apiUrl}/dj-rest-auth/login/`, { email, password })
            .pipe(
                take(1),
                concatMap(tr => this.tokenToUser(tr)),
                concatMap(ru => this.retUserToUser(ru)),
                concatMap(u => iif(
                    () => u.is_student,
                    this.http.get<Student>(`${environment.apiUrl}/students/${u.id}/`).pipe(
                        tap(student => {
                            localStorage.setItem('currentStudent', JSON.stringify(student));
                            this.currentStudentSubject.next(student);
                        })
                    ),
                    of(u))
                )
            );
    }

    /** Logout of the site */
    public logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);

        localStorage.removeItem('currentStudent');
        this.currentStudentSubject.next(null);
    }
}
