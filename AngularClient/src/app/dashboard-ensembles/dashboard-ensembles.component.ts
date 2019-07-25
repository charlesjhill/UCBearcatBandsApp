import { AlertService } from './../_services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Ensemble } from './../_models/Ensemble';
import { EnsembleService } from './../_services/ensemble.service';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export interface DialogData {
  name: string;
  term: string;
  is_active: boolean;
}

@Component({
  selector: 'app-dashboard-ensembles',
  templateUrl: './dashboard-ensembles.component.html',
  styleUrls: ['./dashboard-ensembles.component.css']
})
export class DashboardEnsemblesComponent implements OnInit, OnDestroy {

  ensembles: Ensemble[];
  currentEnsemble: Ensemble;
  subscription: Subscription;

  constructor(private alertService: AlertService,
              private ensembleService: EnsembleService,
              public dialog: MatDialog) { }

  ngOnInit() {
    // Get the ensembles from our ensembleService
    this.subscription = this.ensembleService.currentEnsembles.subscribe(data => {
      this.ensembles = data;
    });

    // Force an update on the ensembleService (in case we never called it before)
    this.ensembleService.update();

    this.currentEnsemble = new Ensemble();
  }

  ngOnDestroy() {
    // If we subscribe in OnInit, we should unsubscribe on destroy
    this.subscription.unsubscribe();
  }

  addEnsemble() {
    console.log('adding ensemble');
    const dialogRef = this.dialog.open(DashEnsembleAddDialog, {
      width: '250px',
      data: {
        name: this.currentEnsemble.name,
        term: this.currentEnsemble.term,
        is_active: this.currentEnsemble.is_active
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Add Ensemble dialog closed');
      if (result) {
        this.ensembleService.add(result)
        .pipe(first())
        .subscribe(
          data => {
            this.alertService.success('Ensemble Added', true);
          }, error => {
            this.alertService.error(error);
          }
        )
        ;
      }

    });
  }
}

@Component({
  selector: 'app-dash-ensemble-add-dialog',
  templateUrl: './dash-ensemble-add-dialog.component.html'
})
export class DashEnsembleAddDialog implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DashEnsembleAddDialog>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      term: [this.data.term, Validators.required],
    });
  }

  save() {
    this.data.is_active = true;
    this.data.name = this.form.controls.name.value;
    this.data.term = this.form.controls.term.value;
    this.dialogRef.close(this.data);
  }

  exit() {
    this.dialogRef.close();
  }


}
