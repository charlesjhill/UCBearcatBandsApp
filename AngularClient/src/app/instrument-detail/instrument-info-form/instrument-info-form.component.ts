import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      kind: [this.instrument.kind, [Validators.required]],
      make: [this.instrument.make, [Validators.required]],
      model: [this.instrument.model, [Validators.required]],
      condition: [this.instrument.condition, [Validators.required]],
      uc_asset_number: [this.instrument.uc_asset_number],
      serial_number: [this.instrument.serial_number],
      uc_tag_number: [this.instrument.uc_tag_number]
    });
    this.instrumentForm.disable(); // We want the form to disabled to begin with
  }

  public editCheckboxToggled() {
    if (this.instrumentForm.enabled) {
      this.instrumentForm.disable();
      // TODO: Decide if "reset form state on disable edit checkbox" is a good idea
      // const { id, locker, name, ...partialInst } = this.instrument;
      // this.instrumentForm.setValue(partialInst);
    } else {
      this.instrumentForm.enable();
    }
  }
}
