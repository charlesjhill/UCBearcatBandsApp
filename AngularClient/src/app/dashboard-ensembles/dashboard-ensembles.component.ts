import { AlertService } from './../_services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Ensemble } from './../_models/Ensemble';
import { EnsembleService } from './../_services/ensemble.service';
import { Component, OnInit, Inject, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBarService } from '../_services/snackbar.service';

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
export class DashboardEnsemblesComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource: MatTableDataSource<Ensemble>;
  currentEnsemble: Ensemble;
  ensSubscription: Subscription;
  ensembles$: Observable<Ensemble[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private alertService: AlertService,
              private ensembleService: EnsembleService,
              public dialog: MatDialog,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    // Get the ensembles from our ensembleService
    this.dataSource = new MatTableDataSource();
    this.ensSubscription = this.ensembleService.currentEnsembles.subscribe(d => {
      this.dataSource.data = d;
      this.dataSource.paginator = this.paginator;
      this.ensembles$ = this.dataSource.connect();
    });

    this.currentEnsemble = new Ensemble();
  }

  ngAfterViewInit() {
    // this.ensSubscription = this.ensembleService.currentEnsembles.subscribe(d => {
    //   this.dataSource.data = d;
    // });
  }

  ngOnDestroy(): void {
    if (this.dataSource) { this.dataSource.disconnect(); }
    if (this.ensSubscription) { this.ensSubscription.unsubscribe(); }
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
        .subscribe(
          data => {
            this.snackBarService.openSnackBar('Ensemble Added');
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
