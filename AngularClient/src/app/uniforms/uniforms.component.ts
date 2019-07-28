import { Component, OnInit, Inject, Input } from '@angular/core';
import { UniformsService, AlertService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Uniform } from '../_models';

@Component({
  selector: 'app-uniforms',
  templateUrl: './uniforms.component.html',
  styleUrls: ['./uniforms.component.css']
})
export class UniformsComponent implements OnInit {

  public inventory
  public new_asset: any;
  displayedColumns: string[] = ["number", "kind", "size", "condition", "assign", "actions"];

  constructor(
    private uniformService: UniformsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private alertService: AlertService,
  ) { }

  public getUniforms() {
    this.uniformService.list().subscribe(
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
    this.getUniforms();
  }

  public condition: any;
  public kind: any;
  public size: any;
  public number: any;

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
    this.uniformService.addUniform(this.new_asset).pipe().subscribe(
      data => {
        this.alertService.success('Registration successful', true);
      }, error => {
        this.alertService.error(error);
      })
  }

  onDelete(id) {
    this.uniformService.deleteUniform(id).pipe().subscribe(
      data => {
        this.alertService.success('Deletion successful', true);
      }, error => {
        this.alertService.error(error);
      })
  }

  onEdit(uniform, id) {
    this.uniformService.updateUniform(uniform, id).pipe().subscribe(
      data => {
        this.alertService.success('Updating successful', true);
      }, error => {
        this.alertService.error(error);
      })
  }

  editForm(uniform: Uniform, id): void {
    let is_closed = false;

    const dialogRef = this.dialog.open(UniformAssignDialog, {
      data: {
        condition: uniform.condition,
        kind: uniform.kind,
        size: uniform.size,
        number: uniform.number
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
        number: uniform.number
      }
    });
  }
}

@Component({
  selector: 'UniformAssignDialog',
  templateUrl: 'dialog.html',
})
export class UniformAssignDialog {
  form: FormGroup;
  kind: string;
  condition: string;
  size: string;
  number: string;
  conditions: string[] = ["new", "good", "fair", "poor", "bad", "unusable"];
  kinds: string[] = ["jacket", "pants"];


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UniformAssignDialog>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.kind = data.kind;
    this.condition = data.condition;
    this.size = data.size;
    this.number = data.number;
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
      condition: [this.condition, []],
      size: [this.size, []],
      number: [this.number, []]
    });
  }

}
