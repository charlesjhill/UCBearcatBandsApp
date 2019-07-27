import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User, Instrument, Ensemble, Uniform, Enrollment, Student } from '../_models';
import { UserService, AuthenticationService, AlertService, EnsembleService, InstrumentsService, UniformsService, EnrollmentService, AssignmentService } from '../_services';
import { RegisterComponent } from '../register';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.css'] })
export class StudentPageComponent implements OnInit {
  currentUser: User;
  currentStudent: Student;
  infoForm: FormGroup;
  submitted = false;
  loading = false;
  ensembles: Ensemble[];
  assets: any[];
  instruments: Instrument[];
  uniforms: Uniform[];
  enrollments: Enrollment[];

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private ensembleService: EnsembleService,
    private instrumentService: InstrumentsService,
    private uniformService: UniformsService,
    private enrollmentService: EnrollmentService,
    private assignmentService: AssignmentService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.currentStudent = this.authenticationService.currentStudentValue;
  }

  getEnrollments() {
    this.enrollmentService.list().subscribe(
      // the first argument is a function which runs on success
      data => {
        this.enrollments = data;
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading')
    );
  }

  getEnsembles() {

    for (let i = 0; i < this.enrollments.length; i++) {
      let id = this.enrollments[i].ensemble;

      this.ensembleService.getEnsemble(id).subscribe(
        // the first argument is a function which runs on success
        data => {
          this.ensembles[i] = data;
        },
        // the second argument is a function which runs on error
        err => console.error(err),
        // the third argument is a function which runs on completion
        () => console.log('done loading')
      );
    }
  }

  getAssets() {
    for (let i = 0; i < this.enrollments.length; i++) {
      let assets = this.enrollments[i].assets;

      for (let j = 0; j < this.assets.length; j++) {
        if (this.assets[i].resourcetype = "Instrument") {
          this.instruments += this.assets[i];
        } else {
          this.uniforms += this.assets[i];
        }
      }
    }
  }


  ngOnInit() {
    //get enrollments
    this.getEnrollments();
    //show ensembles enrolled in
    this.getEnsembles();
    //show instruments
    //show uniforms
    this.getAssets();
  };

}
