import { Ensemble, Enrollment } from '../_models';
import { EnrollmentService, EnsembleService } from '../_services';
import { AssignStudentsComponent } from './assign-students/assign-students.component';

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSlideToggleChange, MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SnackBarService } from '../_services/snackbar.service';

@Component({
  selector: 'app-ensemble-detail',
  templateUrl: './ensemble-detail.component.html',
  styleUrls: ['./ensemble-detail.component.css']
})
export class EnsembleDetailComponent implements OnInit {

  constructor(private ensembleService: EnsembleService,
              private enrollmentService: EnrollmentService,
              public dialog: MatDialog,
              private snackBarService: SnackBarService) { }

  @Input() ensemble: Ensemble;
  public enableDangerZone: boolean;
  dataSource: MatTableDataSource<Enrollment>;
  sortedData: Enrollment[];

  columnsToDisplay = ['name', 'instruments', 'otherAssets', 'actions'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.enableDangerZone = false;
    this.sortedData = this.ensemble.enrollments.slice();
    this.dataSource = new MatTableDataSource(this.sortedData);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name': return item.student.user.full_name;
        case 'instruments': {
          const insts = item.assets.filter(val => val.resourcetype === 'Instrument');
          return (insts ? insts[0].name : '');
        }
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  toggleDangerZone(event: MatSlideToggleChange) {
    this.enableDangerZone = event.checked;
  }

  addStudents() {
    console.log('adding students');
    const dialogRef = this.dialog.open(AssignStudentsComponent, {
      data: {
        ensemble: this.ensemble
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Add students dialog closed');
      if (result) {
        // If we modified an ensemble we need to update
        this.snackBarService.openSnackBar('Students added!');
        this.ensembleService.update();
      }
    });
  }

  removeStudent(enrollmentId: number) {
    console.log(`deleting enrollment ${enrollmentId}`);
    this.enrollmentService.deleteEnrollment(enrollmentId).subscribe(
      result => {
        // We should update just the affected ensemble, in the future
        this.ensembleService.update();
      },
      error => { console.log(error); }
    );
  }

  deleteEnsemble(): void {
    const bar = this.snackBarService.openSnackBar('Are you sure?', 'DELETE', 10000);
    bar.onAction().subscribe(() => {
      console.log('deleting ensemble ' + this.ensemble.id);
      this.snackBarService.openSnackBar('Ensemble Deleted');
      this.ensembleService.delete(this.ensemble.id).subscribe();
    });
  }

}
