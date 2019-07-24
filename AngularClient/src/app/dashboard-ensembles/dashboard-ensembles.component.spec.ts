import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEnsemblesComponent } from './dashboard-ensembles.component';

describe('DashboardEnsemblesComponent', () => {
  let component: DashboardEnsemblesComponent;
  let fixture: ComponentFixture<DashboardEnsemblesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardEnsemblesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEnsemblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
