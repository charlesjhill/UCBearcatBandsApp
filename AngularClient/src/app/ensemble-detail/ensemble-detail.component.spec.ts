import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnsembleDetailComponent } from './ensemble-detail.component';

describe('EnsembleDetailComponent', () => {
  let component: EnsembleDetailComponent;
  let fixture: ComponentFixture<EnsembleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnsembleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnsembleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
