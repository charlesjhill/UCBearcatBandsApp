import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentInfoFormComponent } from './instrument-info-form.component';

describe('InstrumentInfoFormComponent', () => {
  let component: InstrumentInfoFormComponent;
  let fixture: ComponentFixture<InstrumentInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentInfoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
