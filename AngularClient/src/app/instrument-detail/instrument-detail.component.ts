import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Instrument } from '../_models';
import { InstrumentsService } from './../_services/instruments.service';

@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit, OnDestroy {

  private instrumentSub: Subscription;

  instrument: Instrument;

  constructor(private route: ActivatedRoute, private instrumentService: InstrumentsService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.instrumentSub = this.instrumentService.getInstrument(id).subscribe(inst => this.instrument = inst);
  }

  ngOnDestroy(): void {
    this.instrumentSub.unsubscribe();
  }

}
