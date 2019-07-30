import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { User, Instrument, Ensemble, Uniform, Enrollment, Student } from '../_models';
import { UserService, AuthenticationService, AlertService, EnsembleService, AssignmentService } from '../_services';
import { from } from 'rxjs';

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
  ensembles: Ensemble[] = [];
  instruments: Instrument[] = [];
  uniforms: Uniform[] = [];
  enrollments: Enrollment[] = [];
  ensInstruments: any[] = [];
  ensUniforms: any[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private ensembleService: EnsembleService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.currentStudent = this.authenticationService.currentStudentValue;
  }

  ngOnInit() {
    // get enrollments from our loaded student
    this.enrollments = this.currentStudent.enrollments;

    // Iterate the enrollments (as an observable)
    // and asynchronously get the ensemble associated with each,
    // pushing the result into `this.ensembles`
    from(this.enrollments).pipe(
      mergeMap(enrollment => {
        const id = enrollment.ensemble;
        return this.ensembleService.getEnsemble(id);
      })
    ).subscribe(
      ensemble => {
        this.ensembles.push(ensemble);
        console.log(`Loaded ${ensemble.name}`);
        // We can sort this.ensembles at this point to put them
        // in a more desirable order (if we so choose)
      },
      err => console.log(err),
    );

    // Categorize all the assets from all the enrollments
    this.enrollments.forEach(enrollment => {
        enrollment.assets.forEach(asset => {
          switch (asset.resourcetype) {
            case 'Instrument':
              if (!this.ensInstruments[enrollment.ensemble]) {
                this.ensInstruments[enrollment.ensemble] = [];
              }
              this.ensInstruments[enrollment.ensemble].push(asset as Instrument);
              break;
            case 'UniformPiece':
              if (!this.ensUniforms[enrollment.ensemble]) {
                this.ensUniforms[enrollment.ensemble] = [];
              }
              this.ensUniforms[enrollment.ensemble].push(asset as Uniform);
              break;
            default:
              break;
          }
        });
      });
  }
}
