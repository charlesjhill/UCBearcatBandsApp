import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User, Student } from './_models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: User;
    currentStudent: Student;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.authenticationService.currentStudent.subscribe(s => this.currentStudent = s);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
