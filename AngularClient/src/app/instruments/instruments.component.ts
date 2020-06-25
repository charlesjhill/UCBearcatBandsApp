import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Ensemble, Instrument, Student } from '../_models';
import { AlertService, InstrumentsService, EnsembleService, StudentService } from '../_services';
import { SnackBarService } from '../_services';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent implements OnInit {

  constructor(
    private instrumentService: InstrumentsService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private snackBarService: SnackBarService,
    private apollo: Apollo
  ) { }

  // An array of all instrument objects from API
  public dataSource: MatTableDataSource<any>;
  // A mapping of instruments to the string showing what students are assigned to it
  assignedString: Record<number, string> = { };
  displayedColumns: string[] = ['uc_tag_number', 'kind', 'condition', 'assign', 'actions'];

  // An object representing the data in the 'add' form
  public newInstrument = new Instrument();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    const instrumentsAndNames$ = this.apollo.watchQuery<any>({
      query: gql`
        {
          instruments {
            id
            students {
              fullName
            }
          }
        }
      `
    }).valueChanges;

    this.instrumentService.getAll().pipe(
      // Combine our traditional data with the nested information we need
      mergeMap(insts => instrumentsAndNames$.pipe(map(({data}) => ({ insts, data }))))
    ).subscribe(
      ({ insts, data }) => {
        this.dataSource = new MatTableDataSource(insts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        data.instruments.forEach(inst => { this.assignedString[Number(inst.id)] = inst.students.map(s => s.fullName).join(', '); });
      },
      err => console.error(err),
      () => console.log('done loading')
    );
  }

  openAddForm(): void {
    const dialogRef = this.dialog.open(OverviewDialog, {
      data: {
        instrument: this.newInstrument
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.newInstrument = data;
        this.onAdd();
      }
    });
  }

  onAdd() {
    this.instrumentService.add(this.newInstrument).subscribe(
      () => { this.snackBarService.openSnackBar('Instrument Added'); },
      error => { this.alertService.error(error); }
    );
  }

  onDelete(id: number) {
    const bar = this.snackBarService.openDeleteSnackBar('Are you sure?', 'DELETE', 10000);
    bar.onAction().subscribe(() => {
      this.instrumentService.delete(id).subscribe(
        data => { this.snackBarService.openSnackBar('Instrument Deleted'); },
        error => { this.alertService.error(error); }
      );
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
  kinds: string[] = Instrument.possibleKinds;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OverviewDialog>,
    @Inject(MAT_DIALOG_DATA) data)
  {
    this.kind = data.instrument.kind;
    this.make = data.instrument.make;
    this.model = data.instrument.model;
    this.serial_number = data.instrument.serial_number;
    this.uc_tag_number = data.instrument.uc_tag_number;
    this.uc_asset_number = data.instrument.uc_asset_number;
    this.condition = data.instrument.condition;

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
      kind: [{ value: this.kind, disabled: this.readonly }, []],
      make: [{ value: this.make, disabled: this.readonly }, []],
      model: [{ value: this.model, disabled: this.readonly }, []],
      condition: [{ value: this.condition, disabled: this.readonly }, []],
      uc_asset_number: [{ value: this.uc_asset_number, disabled: this.readonly }, []],
      serial_number: [{ value: this.serial_number, disabled: this.readonly }, []],
      uc_tag_number: [{ value: this.uc_tag_number, disabled: this.readonly }, []]
    });
  }

}


export interface AssignDialogData {
  student: Student;
  ensemble: Ensemble;
  dialogName: string;
}

@Component({
  selector: 'InstrumentAssignDialog',
  templateUrl: 'assigndialog.html',
})
export class InstrumentAssignDialog implements OnInit {

  ensForm: FormGroup;
  studentForm: FormGroup;

  ensembles: Ensemble[];
  students: Student[];

  chosenEnsemble: Ensemble;
  chosenStudent: Student;
  dialogName: string;

  constructor(
    private fb: FormBuilder,
    private ensembleService: EnsembleService,
    private studentService: StudentService,
    public dialogRef: MatDialogRef<InstrumentAssignDialog>,
    @Inject(MAT_DIALOG_DATA) data: AssignDialogData) {
    this.chosenEnsemble = data.ensemble;
    this.chosenStudent = data.student;
    this.dialogName = data.dialogName;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    const data = {
      ensemble: this.ensForm.value.ensemble,
      student: this.studentForm.value.student
    };
    this.dialogRef.close(data);
  }

  ngOnInit() {
    this.getEnsembles();
    this.getStudents();
    this.ensForm = this.fb.group({
      ensemble: [this.chosenEnsemble, Validators.required]
    });
    this.studentForm = this.fb.group({
      student: [this.chosenStudent, Validators.required]
    });
  }

  /** Get the list of ensembles from the ensemble service, storing them in this.ensembles */
  private getEnsembles() {
    this.ensembleService.getAll().subscribe(
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

  /** Get the list of students from the student service, storing them in this.students */
  private getStudents() {
    this.studentService.currentStudents$.subscribe(
      // the first argument is a function which runs on success
      data => {
        this.students = data;
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('Students done loading')
    );
    this.studentService.update(); // Force a reload of our students
  }
}
