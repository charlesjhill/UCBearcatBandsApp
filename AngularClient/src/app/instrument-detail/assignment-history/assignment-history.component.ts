import {Component, Injectable, Input, OnDestroy, OnInit} from '@angular/core';
import {Query} from "apollo-angular";
import gql from "graphql-tag";
import {Subscription} from "rxjs";
import {map} from "rxjs/operators";

interface EnrollmentVM {
  student: {
    id: string;
    fullName: string;
  };
  ensemble: {
    name: string;
    endDate: string;  // In ISO format
  }
}

interface InstrumentEnrollments {
  id: string;
  enrollments: EnrollmentVM[];
}

interface Response {
  instruments: InstrumentEnrollments[];
}

@Injectable({
  providedIn: 'root'
})
export class InstrumentEnrollmentsGQL extends Query<Response> {
  document = gql`
    query EnrollmentForInstrument($instId: ID!) {
      instruments(id: $instId) {
        id
        enrollments {
          student {
            id
            fullName
          }
          ensemble {
            name
            endDate
          }
        }
      }
    }
  `;
}

@Component({
  selector: 'app-assignment-history',
  templateUrl: './assignment-history.component.html',
  styleUrls: ['./assignment-history.component.css']
})
export class AssignmentHistoryComponent implements OnInit, OnDestroy {

  constructor(private instEnrollmentService: InstrumentEnrollmentsGQL) { }

  @Input() instId: number;

  private querySubscription: Subscription;
  // A mapping of terms to enrollments objects in that term
  public assignmentVM: [string, EnrollmentVM[]][];

  ngOnInit(): void {
    this.querySubscription = this.instEnrollmentService
      .watch({
        instId: this.instId
      }).valueChanges.pipe(
        map(result => {
          // Group the enrolloments by Date
          const retObj: Record<string, EnrollmentVM[]> = { };
          const instVM = result.data.instruments[0];

          for (const enr of instVM.enrollments) {
            const endDateStr = enr.ensemble.endDate;
            const term = (new Date(endDateStr)).getFullYear();
            if (!retObj[term]) {
              retObj[term] = [];
            }
            retObj[term].push(enr);
          }
          return retObj;
        })
      ).subscribe((res) => {
        // Sort the groups in descending order by date
        this.assignmentVM = Object.entries(res);
          // .sort((a, b) => a[0].localeCompare(b[0]));
      })
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}
