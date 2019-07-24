import { Ensemble } from './../_models/Ensemble';
import { EnsembleService } from './../_services/ensemble.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-ensembles',
  templateUrl: './dashboard-ensembles.component.html',
  styleUrls: ['./dashboard-ensembles.component.css']
})
export class DashboardEnsemblesComponent implements OnInit {

  ensembles: Ensemble[];

  constructor(private ensembleService: EnsembleService) { }

  ngOnInit() {
    this.ensembleService.list().subscribe(data => {
      this.ensembles = data;
    });
  }

}