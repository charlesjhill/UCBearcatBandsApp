import { Component, OnInit, Inject, Input } from '@angular/core';
import { InstrumentsService, AlertService, EnsembleService, UserService, AssignmentService, EnrollmentService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Instrument, Ensemble, Assignment, Enrollment, User, Student } from '../_models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent implements OnInit {

  // An array of all instrument objects from API
  public inventory;

  // An object representing the data in the 'add' form
  public new_instrument: Instrument;

  displayedColumns: string[] = ["tag_number", "kind", "condition",
    //"assign",
    "actions"];
  registerForm: FormGroup;
  constructor(
    private instrumentService: InstrumentsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private alertService: AlertService,
    private enrollmentService: EnrollmentService,
    private assignmentService: AssignmentService,
  ) { }

  public getInstruments() {
    this.instrumentService.list().subscribe(
      // the first argument is a function which runs on success
      data => {
        this.inventory = data;
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading')
    );
  }

  ngOnInit() {
    this.getInstruments()
  }

  public condition: any;
  public kind: any;
  public make: any;
  public model: any;
  public serial_number: any;
  public uc_tag_number: any;
  public uc_asset_number: any;

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
    this.instrumentService.addInstrument(this.new_instrument).pipe().subscribe(
      data => {
        this.alertService.success('Registration successful', true);
      }, error => {
        this.alertService.error(error);
      })
  }

  onDelete(id) {
    this.instrumentService.deleteInstrument(id).pipe().subscribe(
      data => {
        this.alertService.success('Deletion successful', true);
      }, error => {
        this.alertService.error(error);
      })
  }

  onEdit(instrument, id) {
    this.instrumentService.updateInstrument(instrument,id).pipe().subscribe(
      data => {
        this.alertService.success('Updating successful', true);
      }, error => {
        this.alertService.error(error);
      })
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
        uc_asset_number: instrument.uc_asset_number
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
        uc_asset_number: instrument.uc_asset_number
      }
    });
  }

  student: Student;
  ensemble: Ensemble;
  enrollment: Enrollment;
  assignment: Assignment;
  assigned: Student[];

  showAssigned(id): string {
    //hit /instruments/{{id}}/students
    //return student name
    this.instrumentService.getStudentsAssigned(id).subscribe(
      // the first argument is a function which runs on success
      data => {
        this.assigned = data;
        console.log(this.assigned);
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading')
    );

    let names: string;

    //for (let i = 0; i = this.assigned.length; i++) {
      //names += this.assigned[i].user.full_name + ",";
    //}

    return names;
  }

  Assign(id, student: Student, ensemble: Ensemble) {
    //create enrollment
    let enrollment = new Enrollment;
    enrollment.ensemble = ensemble.id;
    enrollment.student = student.user.pk;

    this.enrollmentService.addEnrollment(enrollment).pipe().subscribe(
      data => {
        this.alertService.success('Updating successful', true);
      }, error => {
        this.alertService.error(error);
      })

    //creat assignment
    let assignment = new Assignment;
    assignment.enrollment = enrollment.id;
    assignment.asset = id;

    this.assignmentService.addAssigment(assignment).pipe().subscribe(
      data => {
        this.alertService.success('Updating successful', true);
      }, error => {
        this.alertService.error(error);
      })
  }

  assignForm(instrument: Instrument, id): void {
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


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OverviewDialog>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.kind = data.kind;
    this.make = data.make;
    this.model = data.model;
    this.serial_number = data.serial_number;
    this.uc_tag_number = data.uc_tag_number;
    this.uc_asset_number = data.uc_asset_number;
    this.condition = data.condition;
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
      kind: [this.kind, []],
        make: [this.make, []],
      model: [this.model, []],
      condition: [this.condition, []],
      uc_asset_number: [this.uc_asset_number, []],
      serial_number: [this.serial_number, []],
      uc_tag_number: [this.uc_tag_number, []]
    });
  }

}

@Component({
  selector: 'InstrumnetAssignDialog',
  templateUrl: 'assigndialog.html',
})
export class InstrumentAssignDialog {

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
    this.ensembleService.list().subscribe(
      // the first argument is a function which runs on success
      data => {
        this.ensembles = data;
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('Ensembles done loading')
    );
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
