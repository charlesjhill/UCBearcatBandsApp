import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Ensemble } from '../_models';
import { AlertService, EnsembleService, SnackBarService } from '../_services';
import { switchMap, map } from 'rxjs/operators';

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
  public ensembles$: Observable<Ensemble[]>;
  /** Tracks the currently open ensemble. */
  public selectedEnsemble: number;

  private currentEnsemble: Ensemble;
  private dataSource: MatTableDataSource<Ensemble>;
  private ensSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private alertService: AlertService,
              public dialog: MatDialog,
              private ensembleService: EnsembleService,
              private snackBarService: SnackBarService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => Number(params.get('selectedEnsemble')))
    ).subscribe(selectedEnsemble => this.selectedEnsemble = selectedEnsemble);

    // Get the ensembles from our ensembleService
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.ensSubscription = this.ensembleService.currentEnsembles.subscribe(d => {
      this.dataSource.data = d;
      this.ensembles$ = this.dataSource.connect();
    });

    this.currentEnsemble = new Ensemble();
  }

  ngOnDestroy(): void {
    if (this.dataSource) { this.dataSource.disconnect(); }
    if (this.ensSubscription) { this.ensSubscription.unsubscribe(); }
  }

  changeSelectedEnsemble(newId: number) {
    if (newId === -1) {
      this.router.navigate(['.', { }], { relativeTo: this.route});
      return;
    }
    this.router.navigate(['.', { selectedEnsemble: newId }], {
      relativeTo: this.route
    });
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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

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
