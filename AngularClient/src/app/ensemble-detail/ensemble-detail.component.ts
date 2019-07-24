import { StudentService } from './../student.service';
import { Component, OnInit, Input } from '@angular/core';
import { Ensemble } from '../_models';

@Component({
  selector: 'app-ensemble-detail',
  templateUrl: './ensemble-detail.component.html',
  styleUrls: ['./ensemble-detail.component.css']
})
export class EnsembleDetailComponent implements OnInit {

  constructor(public studentService: StudentService) { }

  @Input() ensemble: Ensemble;

  enrollments: any[];

  ngOnInit() {
  }

}
