import { User, TokenReturn, ReturnUser, Student } from '../_models';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    private currentUserToken: string;

    private currentStudentSubject: BehaviorSubject<Student>;
    public currentStudent: Observable<Student>;

    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserToken = '';
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

    // Use concatMaps to handle the sequential series of steps without having to subscribe
    login(email: string, password: string): Observable<any> {
        return this.http.post<TokenReturn>(`${environment.apiUrl}/rest-auth/login/`, { email, password })
            .pipe(
                concatMap(tr => {
                    // First store the received token, then fire off the request for user details
                    this.currentUserToken = tr.key;

                    // After this call, we are going to rely on `jwt.interceptor` to handle setting this header
                    const httpOptions = {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json',
                            Authorization: `Token ${tr.key}`
                        })
                    };

                    // Get the user details
                    return this.http.get<ReturnUser>(`${environment.apiUrl}/rest-auth/user/`, httpOptions);
                }),
                concatMap(ru => {
                    // Handle the user details, updating our stored 'user' object
                    const user = new User();
                    user.email = ru.email;
                    user.full_name = ru.full_name;
                    user.is_student = ru.is_student;
                    user.id = ru.id;
                    user.token = this.currentUserToken;

                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    if (user.is_student) {
                        return this.http.get(`${environment.apiUrl}/students/${user.id}/`);
                    } else {
                        return of(user);
                    }
                }),
                concatMap(thing => {
                    // Do some janky stuff here to get the student properties IF our person is a student
                    if (thing.hasOwnProperty('m_number') && (thing as Student).m_number) {
                        const student = new Student();
                        student.m_number = (thing as Student).m_number;
                        student.enrollments = (thing as Student).enrollments;
                        localStorage.setItem('currentStudent', JSON.stringify(student));
                        this.currentStudentSubject.next(student);
                    }

                    return of(thing);
                })
            );
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserToken = '';
        this.currentUserSubject.next(null);

        localStorage.removeItem('currentStudent');
        this.currentStudentSubject.next(null);
    }
}
