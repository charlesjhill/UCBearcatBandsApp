import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Instrument } from 'src/app/_models';

@Component({
  selector: 'app-instrument-info-form',
  templateUrl: './instrument-info-form.component.html',
  styles: [
  ]
})
export class InstrumentInfoFormComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  @Input() instrument: Instrument;
  @Output() submitted = new EventEmitter<any>();
  public readonly kinds = Instrument.possibleKinds;
  public readonly conditions: string[] = ['new', 'good', 'fair', 'poor', 'bad', 'unusable'];

  public instrumentForm: FormGroup;

  ngOnInit(): void {
    this.instrumentForm = this.fb.group({
      kind: [this.instrument.kind],
      make: [this.instrument.make],
      model: [this.instrument.model],
      condition: [this.instrument.condition],
      uc_asset_number: [this.instrument.uc_asset_number],
      serial_number: [this.instrument.serial_number],
      uc_tag_number: [this.instrument.uc_tag_number]
    });
    this.instrumentForm.disable(); // We want the form to disabled to begin with
  }

  public editCheckboxToggled() {
    if (this.instrumentForm.enabled) {
      this.instrumentForm.disable();
    } else {
      this.instrumentForm.enable();
    }
  }

  public onSubmit() {
    if (this.instrumentForm.valid) {
      this.submitted.emit(this.instrumentForm.value);
      this.instrumentForm.disable();
    }
  }

}
