import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UniformsService, AlertService } from '../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Uniform } from '../_models';
import { MatSnackBarRef, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SnackBarService } from '../_services/snackbar.service';

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
    private snackBarService: SnackBarService
  ) { }

  public inventory: Uniform[];
  public dataSource: MatTableDataSource<Uniform>;
  public new_asset: any;
  displayedColumns: string[] = ['number', 'kind', 'size', 'condition', 'assign', 'actions'];

  public condition: any;
  public kind: any;
  public size: any;
  public number: any;

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
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading')
    );
  }

  openForm(): void {
    let is_closed = false;

    const dialogRef = this.dialog.open(UniformAssignDialog, {
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

    const dialogRef = this.dialog.open(UniformAssignDialog, {
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

    const dialogRef = this.dialog.open(UniformAssignDialog, {
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
}

@Component({
  selector: 'UniformAssignDialog',
  templateUrl: 'dialog.html',
})
export class UniformAssignDialog implements OnInit {
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
    public dialogRef: MatDialogRef<UniformAssignDialog>,
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
