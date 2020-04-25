import { InstrumentAssignDialog, AssignDialogData } from './../instruments/instruments.component';
import { EnrollmentService } from 'src/app/_services/enrollment.service';
import { AssignmentService } from './../_services/assignments.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UniformsService, AlertService } from '../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Uniform, Student, Ensemble, Enrollment, Assignment } from '../_models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBarService } from '../_services/snackbar.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-uniforms',
  templateUrl: './uniforms.component.html',
  styleUrls: ['./uniforms.component.css']
})
export class UniformsComponent implements OnInit {

  constructor(
    private uniformService: UniformsService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private snackBarService: SnackBarService,
    private assignmentService: AssignmentService,
    private enrollmentService: EnrollmentService
  ) { }

  public inventory: Uniform[];
  public dataSource: MatTableDataSource<Uniform>;
  public new_asset: any;
  displayedColumns: string[] = ['number', 'kind', 'size', 'condition', 'assign', 'actions'];

  public condition: any;
  public kind: any;
  public size: any;
  public number: any;
  assignedString: string[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.getUniforms();
  }

  public getUniforms() {
    this.uniformService.currentUniforms.subscribe(
      // the first argument is a function which runs on success
      data => {
        this.inventory = data;
        this.dataSource = new MatTableDataSource(this.inventory);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        for (const uni of this.inventory) {
          this.getAssigned(uni.id);
        }
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading')
    );
  }

  openForm(): void {
    let is_closed = false;

    const dialogRef = this.dialog.open(CreateUniformDialog, {
      data: {
        condition: this.condition,
        kind: this.kind,
        size: this.size,
        number: this.number
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.new_asset = data;
        console.log(this.new_asset);
        this.onAdd();
      }
    });
  }

  onAdd() {
    this.uniformService.addUniform(this.new_asset).subscribe(
      data => {
        this.snackBarService.openSnackBar('Registration successful');
      }, error => {
        this.alertService.error(error);
      });
  }

  onDelete(id: number) {
    const bar = this.snackBarService.openDeleteSnackBar('Are you sure?', 'DELETE', 5000);
    bar.onAction().subscribe(() => {
      this.uniformService.deleteUniform(id).subscribe(
        data => {
          this.snackBarService.openSnackBar('Deletion successful');
        }, error => {
          this.alertService.error(error);
        }
      );
    });
  }

  onEdit(uniform: Uniform, id: number) {
    this.uniformService.updateUniform(uniform, id).subscribe(
      data => {
        this.snackBarService.openSnackBar('Updating successful');
      }, error => {
        this.alertService.error(error);
      });
  }

  editForm(uniform: Uniform, id: number): void {
    let is_closed = false;

    const dialogRef = this.dialog.open(CreateUniformDialog, {
      data: {
        condition: uniform.condition,
        kind: uniform.kind,
        size: uniform.size,
        number: uniform.number,
        title: 'Edit Uniform',
        detail: 'Change any desired fields',
        readonly: false
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.new_asset = data;
        console.log(this.new_asset);
        this.onEdit(this.new_asset, id);
      }
    });
  }

  viewForm(uniform: Uniform): void {
    let is_closed = false;

    const dialogRef = this.dialog.open(CreateUniformDialog, {
      data: {
        condition: uniform.condition,
        kind: uniform.kind,
        size: uniform.size,
        number: uniform.number,
        title: 'Uniform details',
        detail: ' ',
        readonly: true
      }
    });
  }

  public getAssigned(id: number): void {
    // hit /uniforms/{{id}}/students
    // return student name
    let names = '';
    this.uniformService.getStudentsAssigned(id).subscribe(
      // the first argument is a function which runs on success
      data => {
        names = data.map(d => d.user.full_name).join(', ');
        this.assignedString[id] = names;
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading')
    );
  }

  private getEnrollment(student: Student, ensemble: Ensemble): Observable<Enrollment> {
    // Check if the enrollment alreday exists
    for (const enr of ensemble.enrollments) {
      if (enr.student.m_number === student.m_number) {
        console.log('found enrollment');
        return of(enr);
      }
    }

    // If we make it here, there is no matching enrollment, so we have to make one
    console.log('creating enrollment');
    const newEnr = new Enrollment();
    newEnr.student = student.user.id;
    newEnr.ensemble = ensemble.id;
    return this.enrollmentService.addEnrollment(newEnr);
  }

  private Assign(id: number, student: Student, ensemble: Ensemble): void {
    // create enrollment
    this.getEnrollment(student, ensemble).subscribe(
      enr => {
        // Check if assignment already exists
        console.log('creating assignment');
        const newAsm = new Assignment();
        newAsm.enrollment = enr.id;
        newAsm.asset = id;
        this.assignmentService.addAssigment(newAsm).subscribe(
          data => {
            this.snackBarService.openSnackBar('Instrument Assigned!');
            this.uniformService.update();
          },
          err => { console.log(err); }
        );
      },
      err => { console.log(err); }
    );
  }

  public assignForm(uniform: Uniform, id: number): void {
    const assignData: AssignDialogData = {
      ensemble: null,
      student: null,
      dialogName: uniform.name
    };

    const dialogRef = this.dialog.open(InstrumentAssignDialog, {
      data: assignData
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        console.log(data);
        this.Assign(id, data.student, data.ensemble);
      }
    });
  }
}

@Component({
  selector: 'CreateUniformDialog',
  templateUrl: 'dialog.html',
})
export class CreateUniformDialog implements OnInit {
  form: FormGroup;
  kind: string;
  condition: string;
  size: string;
  number: string;
  title: string;
  detail: string;
  readonly: boolean;

  conditions: string[] = ['new', 'good', 'fair', 'poor', 'bad', 'unusable'];
  kinds: string[] = ['jacket', 'pants'];


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateUniformDialog>,
    @Inject(MAT_DIALOG_DATA) data)
  {
    this.kind = data.kind;
    this.condition = data.condition;
    this.size = data.size;
    this.number = data.number;
    this.title = data.title || 'Add Uniform';
    this.detail = data.detail || 'Input data into the fields to create a uniform';
    this.readonly = data.readonly || false;
  }

  onNoClick() {
    // Could we add the instrument service call here?
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  ngOnInit() {
    this.form = this.fb.group({
      kind: [{ value: this.kind, disabled: this.readonly }, []],
      condition: [{ value: this.condition, disabled: this.readonly }, []],
      size: [{ value: this.size, disabled: this.readonly }, []],
      number: [{ value: this.number, disabled: this.readonly }, []]
    });
  }

}
