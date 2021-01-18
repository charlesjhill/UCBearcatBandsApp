import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, from } from 'rxjs';
import { mergeMap, reduce, map, switchMap, filter, first } from 'rxjs/operators';
import { Enrollment, Ensemble } from '../_models';
import { EnrollmentService, EnsembleService, SnackBarService, StudentService } from '../_services';
import { AssignStudentsComponent } from './assign-students/assign-students.component';
import type { Student } from '../_models';

@Component({
  selector: 'app-ensemble-detail',
  templateUrl: './ensemble-detail.component.html',
  styleUrls: ['./ensemble-detail.component.css']
})
export class EnsembleDetailComponent implements OnInit {

  constructor(private ensembleService: EnsembleService,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    public dialog: MatDialog,
    private snackBarService: SnackBarService) { }

  @Input() ensemble: Ensemble;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public enableDangerZone: boolean;
  public dataSource: MatTableDataSource<Enrollment>;
  public columnsToDisplay = ['name', 'instruments', 'otherAssets', 'actions'];

  private sortedData: Enrollment[];

  ngOnInit() {
    this.enableDangerZone = false;

    from(this.ensemble.enrollments as number[]).pipe(
      mergeMap(enrollmentId => this.enrollmentService.get(enrollmentId).pipe(first())),
      mergeMap(enrollment => {
        // Get the student and assets associated with the enrollment
        const student$ = this.studentService.details(enrollment.student as number);
        const assets$ = from(enrollment.assets as number[]).pipe(
          mergeMap(assetId => this.enrollmentService.getAsset(assetId)),
          reduce((acc, asset) => [...acc, asset], [])
        );

        return forkJoin({
          student: student$,
          assets: assets$
        }).pipe(map(things => ({ ...things, id: enrollment.id })));
      }),
      reduce((acc, enrollment) => [...acc, enrollment], [])
    ).subscribe(data => {
      this.sortedData = data;
      this.dataSource = new MatTableDataSource(this.sortedData);
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'name': return (item.student as any).user.full_name;
          case 'instruments': {
            const insts = item.assets.filter(val => val.resourcetype === 'Instrument');
            return (insts ? insts[0].name : '');
          }
          default: return item[property];
        }
      };
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
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
        this.ensembleService.fetch(this.ensemble.id);
      }
    });
  }

  removeStudent(enrollmentId: number) {
    const bar = this.snackBarService.openDeleteSnackBar('Are you sure?', 'DELETE', 6000);
    bar.onAction().subscribe(() => {
      console.log(`deleting enrollment ${enrollmentId}`);
      this.enrollmentService.delete(enrollmentId).subscribe(
        result => {
          this.ensembleService.fetch(this.ensemble.id);
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

  getStudentEmail(enrollment: Enrollment): string {
    return `mailto:${(enrollment.student as Student).user.email}`
  }
}
