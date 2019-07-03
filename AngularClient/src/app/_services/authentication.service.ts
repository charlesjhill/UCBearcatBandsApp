import { User, TokenReturn, ReturnUser } from '../_models';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    private currentUserToken: string;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserToken = '';
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    // Use concatMaps to handle the sequential series of steps without having to subscribe
    login(email: string, password: string): Observable<User> {
        return this.http.post<TokenReturn>(`${environment.apiUrl}/rest-auth/login/`, { email, password })
            .pipe(
                concatMap(lr => {
                    // First store the received token, then fire off the request for user details
                    this.currentUserToken = lr.key;

                    // After this call, we are going to rely on `jwt.interceptor` to handle setting this header
                    const httpOptions = {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json',
                            Authorization: `Token ${lr.key}`
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
                    user.m_number = ru.m_number;
                    user.pk = ru.pk;
                    user.token = this.currentUserToken;

                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return of(user);
                })
            );
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserToken = '';
        this.currentUserSubject.next(null);
    }
}
