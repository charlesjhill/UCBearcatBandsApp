import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Ensemble, Student } from 'src/app/_models';
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
    this.students$ = this.studentService.currentStudents;
    this.studentService.update();
  }

  saveEnrollments(selected: number[]) {
    // We should add an endpoint that accepts batch processing
    from(selected).pipe(
      concatMap(id => {
        return this.enrollmentService.addEnrollment(this.data.ensemble.id, id);
      })
    ).subscribe(data => {
      console.log('successfully enrolled a student');
    }, error => {
      console.log('error: ' + error);
    });
  }

}
