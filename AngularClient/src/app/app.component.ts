import { SidebarService } from './_services/sidebar.service';
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
        private authenticationService: AuthenticationService,
        private sidebarService: SidebarService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.authenticationService.currentStudent.subscribe(s => this.currentStudent = s);
    }

    toggleSidebar(): void {
        this.sidebarService.toggleSidebar();
    }

    logout(): void {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
