import { SnackBarService } from './../_services/snackbar.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Instrument } from '../_models';
import { InstrumentsService } from '../_services/instruments.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit, OnDestroy {

  private instrumentSub: Subscription;

  instrument: Instrument;

  constructor(private route: ActivatedRoute,
              private instrumentService: InstrumentsService,
              private snackBar: SnackBarService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.instrumentSub = this.instrumentService.currentInstruments$.pipe(
      map(insts => insts.find(i => i.id === id))
    ).subscribe(i => this.instrument = i);
  }

  ngOnDestroy(): void {
    this.instrumentSub.unsubscribe();
  }

  instrumentDetailsEdited(newInst: Partial<Instrument>): void {
    const newInstrument = Object.assign(this.instrument, newInst);
    this.instrumentService.updateInstrument(newInstrument).subscribe({
      next: () => this.snackBar.openSnackBar('Update Successful'),
      error: () => this.snackBar.openDeleteSnackBar('Update Failed')
    });
  }

}
