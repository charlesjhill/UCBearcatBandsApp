import { Ensemble } from '../_models';
import { EnsembleService } from './../_services/ensemble.service';
import { StudentService, AlertService } from '../_services';

import { Component, OnInit, Input } from '@angular/core';
import { MatSlideToggleChange, MatDialog } from '@angular/material';
import { AssignStudentsComponent } from './assign-students/assign-students.component';

@Component({
  selector: 'app-ensemble-detail',
  templateUrl: './ensemble-detail.component.html',
  styleUrls: ['./ensemble-detail.component.css']
})
export class EnsembleDetailComponent implements OnInit {

  constructor(private ensembleService: EnsembleService,
              private alertService: AlertService,
              public dialog: MatDialog) { }

  @Input() ensemble: Ensemble;
  @Input() isOpen: boolean;
  public enableDangerZone: boolean;

  ngOnInit() {
    this.enableDangerZone = false;
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
        this.ensembleService.update();
      }
    });
  }

  deleteEnsemble(): void {
    console.log('deleting ensemble ' + this.ensemble.id);
    this.ensembleService.delete(this.ensemble.id).subscribe();
  }

}
