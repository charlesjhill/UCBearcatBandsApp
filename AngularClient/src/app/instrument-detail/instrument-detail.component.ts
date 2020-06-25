import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Instrument } from '../_models';
import { InstrumentsService } from '../_services';
import { SnackBarService } from '../_services';

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
    this.instrumentSub = this.instrumentService.get(id)
      .subscribe(i => this.instrument = i);
  }

  ngOnDestroy(): void {
    this.instrumentSub.unsubscribe();
  }

  instrumentDetailsEdited(newInst: Partial<Instrument>): void {
    if (!newInst) { return; }
    const newInstrument = Object.assign(this.instrument, newInst);
    this.instrumentService.update(newInstrument).subscribe({
      next: () => this.snackBar.openSnackBar('Update Successful'),
      error: () => this.snackBar.openDeleteSnackBar('Update Failed')
    });
  }

}
