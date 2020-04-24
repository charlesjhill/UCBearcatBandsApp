import { User, TokenReturn, ReturnUser, Student } from '../_models';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, iif, throwError } from 'rxjs';
import { concatMap, take, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    private currentUserToken = '';

    private currentStudentSubject: BehaviorSubject<Student>;
    public currentStudent: Observable<Student>;

    public currentUser: Observable<User>;

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
    private tokenToUser(tr: TokenReturn): Observable<ReturnUser> {
        // First store the received token, then fire off the request for user details
        this.currentUserToken = tr.key;

        // After the following call, we are going to rely on `jwt.interceptor` to handle setting this header
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Token ${tr.key}`
            })
        };

        // Get the user details (which uses the auth token)
        return this.http.get<ReturnUser>(`${environment.apiUrl}/rest-auth/user/`, httpOptions);
    }

    /** Convert a returnUser to full user instance (with a token) and perform some side effects 8) */
    private retUserToUser(ru: ReturnUser): Observable<User> {
        // Handle the user details, updating our stored 'user' object
        const user = new User();
        user.email = ru.email;
        user.full_name = ru.full_name;
        user.is_student = ru.is_student;
        user.id = ru.id;
        user.token = this.currentUserToken;

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);

        return of(user);
    }

    private handleAuthError(err: HttpErrorResponse) {
        if (err.error instanceof ErrorEvent) {
            console.error('An error occured:', err.error.message);
        } else {
            console.error(`Backend returned code ${err.status}, ` +
                          `body was: ${err.error}`);
        }

        return throwError('Invalid login credentials');
    }

    /** Login to the site, receiving an API token if everything is good */
    public login(email: string, password: string) {
        return this.http.post<TokenReturn>(`${environment.apiUrl}/rest-auth/login/`, { email, password })
            .pipe(
                take(1),
                catchError(this.handleAuthError),
                concatMap(tr => this.tokenToUser(tr)),
                concatMap(ru => this.retUserToUser(ru)),
                concatMap(u => iif(() => u.is_student, this.http.get(`${environment.apiUrl}/students/${u.id}/`), of(u))),
                tap(thing => {
                    if (thing.hasOwnProperty('m_number') && (thing as Student).m_number) {
                        const student = new Student();
                        student.m_number = (thing as Student).m_number;
                        student.enrollments = (thing as Student).enrollments;
                        localStorage.setItem('currentStudent', JSON.stringify(student));
                        this.currentStudentSubject.next(student);
                    }
                })
            );
    }

    /** Logout of the site */
    public logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserToken = '';
        this.currentUserSubject.next(null);

        localStorage.removeItem('currentStudent');
        this.currentStudentSubject.next(null);
    }
}
