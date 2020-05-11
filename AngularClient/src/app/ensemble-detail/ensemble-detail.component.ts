import { Ensemble, Enrollment } from '../_models';
import { EnrollmentService, EnsembleService } from '../_services';
import { AssignStudentsComponent } from './assign-students/assign-students.component';

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    const bar = this.snackBarService.openDeleteSnackBar('Are you sure?', 'DELETE', 6000);
    bar.onAction().subscribe(() => {
      console.log(`deleting enrollment ${enrollmentId}`);
      this.enrollmentService.deleteEnrollment(enrollmentId).subscribe(
        result => {
          // We should update just the affected ensemble, in the future
          this.ensembleService.update();
        },
        error => { console.log(error); }
      );
      this.snackBarService.openSnackBar('Enrollment Deleted');
    });
  }

  deleteEnsemble(): void {
    const bar = this.snackBarService.openDeleteSnackBar('Are you sure?', 'DELETE', 6000);
    bar.onAction().subscribe(() => {
      console.log('deleting ensemble ' + this.ensemble.id);
      this.snackBarService.openSnackBar('Ensemble Deleted');
      this.ensembleService.delete(this.ensemble.id).subscribe();
    });
  }

  getAssignedInstruments(enrollment: Enrollment): any[] {
    return enrollment.assets.filter(a => a.resourcetype === 'Instrument');
  }

  getAssignedOtherAssets(enrollment: Enrollment): any[] {
    return enrollment.assets.filter(a => a.resourcetype !== 'Instrument');
  }
}
