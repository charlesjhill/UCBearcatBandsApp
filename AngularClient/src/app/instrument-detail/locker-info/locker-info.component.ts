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
    console.log('lockerNum: ' + n);
    if (n) {
      this.locker$ = this.lockerService.getLocker(n);
    } else {
      this.locker$ = EMPTY;
    }
  }

}
