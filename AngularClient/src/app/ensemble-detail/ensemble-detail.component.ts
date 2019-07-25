import { EnsembleService } from './../_services/ensemble.service';
import { StudentService } from './../student.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Ensemble } from '../_models';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-ensemble-detail',
  templateUrl: './ensemble-detail.component.html',
  styleUrls: ['./ensemble-detail.component.css']
})
export class EnsembleDetailComponent implements OnInit {

  constructor(private studentService: StudentService,
              private ensembleService: EnsembleService) { }

  @Input() ensemble: Ensemble;
  @Input() isOpen: boolean;
  public enableDangerZone: boolean;

  ngOnInit() {
    this.enableDangerZone = false;
  }

  toggleDangerZone(event: MatSlideToggleChange) {
    this.enableDangerZone = event.checked;
  }

  deleteEnsemble(): void {
    console.log('deleting ensemble ' + this.ensemble.id);
    this.ensembleService.delete(this.ensemble.id).subscribe();
  }

}
