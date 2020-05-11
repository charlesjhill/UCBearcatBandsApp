import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { Ensemble, Student, PostEnrollment } from 'src/app/_models';
import { StudentService } from 'src/app/_services';
import { Observable, of, from } from 'rxjs';
import { EnrollmentService } from 'src/app/_services/enrollment.service';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-assign-students',
  templateUrl: './assign-students.component.html',
  styleUrls: ['./assign-students.component.css']
})
export class AssignStudentsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AssignStudentsComponent>,
    @Inject (MAT_DIALOG_DATA) public data: { ensemble: Ensemble },
    private studentService: StudentService,
    private enrollmentService: EnrollmentService
  ) { }

  students$: Observable<Student[]>;

  ngOnInit() {
    this.students$ = this.studentService.currentStudents$;
    this.studentService.update();
  }

  saveEnrollments(selectedOptions: MatListOption[]) {
  // Sequentially add the selected students, waiting for a response before moving on
  // TODO: We should create a bulk-enrollment endpoint enventually
    from(selectedOptions).pipe(
      concatMap(option => {
        const payload = new PostEnrollment();
        payload.ensemble = this.data.ensemble.id;
        payload.student = option.value;

        return this.enrollmentService.addEnrollment(payload);
      })
    ).subscribe(
      data => { console.log('successful enrollment'); },
      error => { console.log(error); }
    );

    this.dialogRef.close(true);
  }

}
