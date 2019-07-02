import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { RegisterComponent } from '../register';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: User;
    infoForm: FormGroup;
    submitted = false;
    loading = false;

    constructor(
        private authenticationService: AuthenticationService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.infoForm = this.formBuilder.group({
            fullName: [this.currentUser.full_name, Validators.required],
            email: [this.currentUser.email, Validators.required],
            mnumber: [this.currentUser.m_number, [Validators.required, RegisterComponent.mnumberValidator]],
        });
    }

    get f() { return this.infoForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        if (this.infoForm.invalid) {
            return;
        }

        this.loading = true;
        this.currentUser.full_name = this.f.fullName.value;
        this.currentUser.m_number = this.f.mnumber.value;
        this.currentUser.email = this.f.email.value;

        this.userService.update(this.currentUser)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Data saved', true);
                    this.currentUser = data;
                }
            );
    }
}
