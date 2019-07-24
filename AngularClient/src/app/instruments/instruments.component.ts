import { Component, OnInit, Inject, Input } from '@angular/core';
import { InstrumentsService, AlertService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  displayedColumns: string[] = ["tag_number", "kind", "condition", "assign", "actions"];

  // Api to hit
  private __url = 'http://localhost:8000/instruments/'
  registerForm: FormGroup;
  constructor(
    private instrumentService: InstrumentsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private alertService: AlertService,
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
    //this.user = {
      //username: '',
      //password: ''
    //};
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
}

export interface Instrument {
  kind: string;
  make: string;
  model: string;
  serial_number: string;
  uc_tag_number: string;
  uc_asset_number: string;
  condition: string;
}

export class InstrumentClass {
  kind: string;
  make: string;
  model: string;
  serial_number: string;
  uc_tag_number: string;
  uc_asset_number: string;
  condition: string;
}

@Component({
  selector: 'OverviewDialog',
  templateUrl: 'dialog.html',
})
export class OverviewDialog {

  public instrument: InstrumentClass;
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
