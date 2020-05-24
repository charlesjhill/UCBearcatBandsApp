import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerInfoComponent } from './locker-info.component';

describe('LockerInfoComponent', () => {
  let component: LockerInfoComponent;
  let fixture: ComponentFixture<LockerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
