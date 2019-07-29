import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { InstrumentsService, AlertService, EnsembleService, UserService, AssignmentService, EnrollmentService } from '../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Instrument, Ensemble, Assignment, Enrollment, User, Student } from '../_models';
import { Observable } from 'rxjs';
import { MatSnackBarRef, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent implements OnInit {

  constructor(
    private instrumentService: InstrumentsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private alertService: AlertService,
    private enrollmentService: EnrollmentService,
    private assignmentService: AssignmentService,
    private _snackBar: MatSnackBar
  ) { }

  // An array of all instrument objects from API
  public inventory;
  public dataSource: MatTableDataSource<Instrument>;

  // An object representing the data in the 'add' form
  public new_instrument: Instrument;

  displayedColumns: string[] = [
    'uc_tag_number',
    'kind',
    'condition',
    // "assign",
    'actions'
  ];
  registerForm: FormGroup;

  public condition: any;
  public kind: any;
  public make: any;
  public model: any;
  public serial_number: any;
  public uc_tag_number: any;
  public uc_asset_number: any;

  student: Student;
  ensemble: Ensemble;
  enrollment: Enrollment;
  assignment: Assignment;
  assigned: Student[];
  assigned_String: string[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public getInstruments() {
    this.instrumentService.currentInstruments.subscribe(
      // the first argument is a function which runs on success
      data => {
        this.inventory = data;
        this.dataSource = new MatTableDataSource(this.inventory);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.inventory);
        for (const instrument of this.inventory) {
          this.showAssigned(instrument.id);
        }
        console.log(this.assigned_String);
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading')
    );
  }

  private openSnackBar(message: string): MatSnackBarRef<any> {
    return this._snackBar.open(message, '', {
      duration: 2000
    });
  }

  ngOnInit() {
    this.getInstruments();
  }

  // TODO: Descriptive function naming
  openForm(): void {
    let is_closed = false;

    const dialogRef = this.dialog.open(OverviewDialog, {
      data: {
        condition: this.condition,
        kind: this.kind,
        make: this.make,
        model: this.model,
        serial_number: this.serial_number,
        uc_tag_number: this.uc_tag_number,
        uc_asset_number: this.uc_asset_number
      }
    });

    dialogRef.afterClosed().subscribe(data => {
          if (data != null) {
            this.new_instrument = data;
            console.log(this.new_instrument);
            this.onAdd();
          }
      });
  }

  onAdd() {
    this.instrumentService.addInstrument(this.new_instrument).subscribe(
      data => {
        // TODO: Consider shifting this to a snackbar
        this.openSnackBar('Instrument Added');
      }, error => {
        this.alertService.error(error);
      });
  }

  onDelete(id: number) {
    this.instrumentService.deleteInstrument(id).subscribe(
      data => {
        this.openSnackBar('Instrument Deleted');
      }, error => {
        this.alertService.error(error);
      });
  }

  onEdit(instrument: Instrument, id: number) {
    this.instrumentService.updateInstrument(instrument, id).subscribe(
      data => {
        this.openSnackBar('Instrument Updated');
      }, error => {
        this.alertService.error(error);
      });
  }

  editForm(instrument: Instrument, id): void {
    let is_closed = false;

    const dialogRef = this.dialog.open(OverviewDialog, {
      data: {
        condition: instrument.condition,
        kind: instrument.kind,
        make: instrument.make,
        model: instrument.model,
        serial_number: instrument.serial_number,
        uc_tag_number: instrument.uc_tag_number,
        uc_asset_number: instrument.uc_asset_number,
        title: 'Edit Instrument',
        detail: 'Change any desired fields',
        readonly: false
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.new_instrument = data;
        console.log(this.new_instrument);
        this.onEdit(this.new_instrument, id);
      }
    });
  }

  viewForm(instrument: Instrument): void {
    let is_closed = false;

    const dialogRef = this.dialog.open(OverviewDialog, {
      data: {
        condition: instrument.condition,
        kind: instrument.kind,
        make: instrument.make,
        model: instrument.model,
        serial_number: instrument.serial_number,
        uc_tag_number: instrument.uc_tag_number,
        uc_asset_number: instrument.uc_asset_number,
        title: 'Instrument Details',
        detail: ' ',
        readonly: true
      }
    });
  }

  public showAssigned(id: number) {
    //hit /instruments/{{id}}/students
    //return student name
    this.instrumentService.getStudentsAssigned(id).subscribe(
      // the first argument is a function which runs on success
      data => {
        this.assigned = data;
        console.log(this.assigned);

        let names: string;

        for (let i = 0; i < this.assigned.length; i++) {
          console.log(this.assigned[i].user.full_name);
          names += this.assigned[i].user.full_name + ",";
        }

        console.log(names);
        this.assigned_String[id] = names;
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading')
    );
  }

  Assign(id: number, student: Student, ensemble: Ensemble) {
    // create enrollment
    // TODO: We should check if an enrollment exists first
    const enrollment = new Enrollment();
    enrollment.ensemble = ensemble.id;
    enrollment.student = student.user.id;

    this.enrollmentService.addEnrollment(enrollment).subscribe(
      data => {
        this.openSnackBar('Enrollment Added/Updated!');
      }, error => {
        this.alertService.error(error);
      });

    // create assignment
    const assignment = new Assignment();
    assignment.enrollment = enrollment.id;
    assignment.asset = id;

    this.assignmentService.addAssigment(assignment).subscribe(
      data => {
        this.openSnackBar('Instrument Assigned!');
      }, error => {
        this.alertService.error(error);
      });
  }

  assignForm(instrument: Instrument, id: number): void {
    let is_closed = false;

    const dialogRef = this.dialog.open(InstrumentAssignDialog, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        console.log(data);
      }
    });
  }
}

@Component({
  selector: 'OverviewDialog',
  templateUrl: 'dialog.html',
})
export class OverviewDialog implements OnInit {
  form: FormGroup;
  kind: string;
  make: string;
  model: string;
  serial_number: string;
  uc_tag_number: string;
  uc_asset_number: any;
  condition: string;
  readonly: boolean;
  title: string;
  detail: string;

  conditions: string[] = ['new', 'good', 'fair', 'poor', 'bad', 'unusable'];
  kinds: string[] = ['Flute', 'Piccolo', 'Clarinet', 'Alto Saxaphone', 'Tenor Saxaphoe', 'Baritone Saxaphone', 'Oboe', 'Trumpet', 'Mellophone', 'Baritone', 'Trombone', 'French Horn', 'Tuba',
    'Sousaphone', 'Snare Drum', 'Bass Drum', 'Tenor Drum', 'Marimba'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OverviewDialog>,
    @Inject(MAT_DIALOG_DATA) data)
  {
    this.kind = data.kind;
    this.make = data.make;
    this.model = data.model;
    this.serial_number = data.serial_number;
    this.uc_tag_number = data.uc_tag_number;
    this.uc_asset_number = data.uc_asset_number;
    this.condition = data.condition;

    this.readonly = data.readonly || false;
    this.title = data.title || 'Add Instrument';
    this.detail = data.detail || 'Input data into the fileds to create an Instrument';
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
      kind: [{value: this.kind, disabled: this.readonly}, []],
        make: [{value: this.make, disabled: this.readonly}, []],
      model: [{value: this.model, disabled: this.readonly}, []],
      condition: [{value: this.condition, disabled: this.readonly}, []],
      uc_asset_number: [{value: this.uc_asset_number, disabled: this.readonly}, []],
      serial_number: [{value: this.serial_number, disabled: this.readonly}, []],
      uc_tag_number: [{value: this.uc_tag_number, disabled: this.readonly}, []]
    });
  }

}

@Component({
  selector: 'InstrumnetAssignDialog',
  templateUrl: 'assigndialog.html',
})
export class InstrumentAssignDialog implements OnInit {

  assignForm: FormGroup;
  ensembles: Ensemble[];
  students: Student[];
  choosen_ensemble: Ensemble;
  choosen_student: Student;

  constructor(
    private fb: FormBuilder,
    private ensembleService: EnsembleService,
    private userService: UserService,
    public dialogRef: MatDialogRef<InstrumentAssignDialog>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.choosen_ensemble = data.ensemble;
    this.choosen_student = data.student;

  }

  onNoClick() {
    // Could we add the instrument service call here?
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.assignForm.value);
  }

  ngOnInit() {
    this.getEnsembles();
    this.getStudents();
    this.assignForm = this.fb.group({
      choosen_ensemble: [this.choosen_ensemble, []],
      choosen_student: [this.choosen_student, []],
    });
  }

  public getEnsembles() {
    this.ensembleService.currentEnsembles.subscribe(
      // the first argument is a function which runs on success
      data => {
        this.ensembles = data;
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('Ensembles done loading')
    );
    this.ensembleService.update();
  }

 public getStudents() {
    this.userService.list().subscribe(
      // the first argument is a function which runs on success
      data => {
        this.students = data;
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('Students done loading')
    );
  }
}
