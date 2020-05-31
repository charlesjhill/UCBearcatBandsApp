import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Locker } from 'src/app/_models';
import { LockerService } from 'src/app/_services';

@Component({
  selector: 'app-locker-info',
  templateUrl: './locker-info.component.html',
  styleUrls: ['./locker-info.component.css']
})
export class LockerInfoComponent implements OnChanges {

  @Input() lockerNum: number;
  public locker$: Observable<Locker>;

  constructor(private lockerService: LockerService) { }

  ngOnChanges(changes: SimpleChanges) {
    const n = changes.lockerNum.currentValue;
    if (n) {
      this.locker$ = this.lockerService.get(n);
    } else {
      this.locker$ = EMPTY;
    }
  }

}
