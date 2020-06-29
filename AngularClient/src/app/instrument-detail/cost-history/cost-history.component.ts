import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

interface LineItemVM {
  id: string;
  cost: number;
  notes: string;
  invoice: {
    id: string,
    date: string,
    notes: string
  };
}

interface HistoryVM {
  id: string;
  purchase: LineItemVM[];
  maintenances: LineItemVM[];
  accumulatedCost: number;
}

interface Response {
  instruments: HistoryVM[];
}

const CostHistoryForInstrument = gql`
  query CostHistoryForInstrument($instId: ID!) {
    instruments(id: $instId) {
      id
      purchase: lineItems(type: PURCHASE) {
        ...liInfo
      }
      maintenances: lineItems(type: MAINTENANCE) {
        ...liInfo
      }
      accumulatedCost
    }
  }

  fragment liInfo on LineItem {
    id
    cost
    notes
    invoice {
      id
      date
      notes
    }
  }
`;

@Component({
  selector: 'app-cost-history[instId]',
  templateUrl: './cost-history.component.html',
  styleUrls: ['./cost-history.component.css']
})
export class CostHistoryComponent implements OnInit, OnDestroy {

  @Input() instId: number;

  private querySubscription: Subscription;
  public fullReturnData: HistoryVM = null;
  public purchaseVM: LineItemVM;
  public maintenancesVM: LineItemVM[];
  public costToReplace = 0;

  constructor(private apollo: Apollo, private http: HttpClient) { }

  ngOnInit(): void {
    if (this.instId === null || this.instId === undefined) {
      throw new TypeError('The input "instId" is required');
    }

    this.querySubscription = this.apollo.watchQuery<Response>({
      query: CostHistoryForInstrument,
      variables: {
        instId: this.instId
      }
    }).valueChanges.pipe(
      map(res => res.data.instruments[0])
    ).subscribe(retData => {
      this.fullReturnData = retData;
      this.purchaseVM = retData.purchase?.[0];
      this.maintenancesVM = retData.maintenances
        .sort((a, b) => a.invoice.date.localeCompare(b.invoice.date));
      this.getCostToReplace(this.purchaseVM);
    });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  public getCostToReplace(purchase: LineItemVM): void {
    if (!purchase) {
      return;
    }
    const apiUrl = 'https://www.statbureau.org/calculate-inflation-price-json';

    let params = new HttpParams();
    params = params.append('country', 'united-states');
    params = params.append('start', purchase.invoice.date);
    params = params.append('end', (new Date(Date.now())).toISOString());
    params = params.append('amount', purchase.cost.toString());
    params = params.append('format', 'false');

    this.http.get<any>(apiUrl, {
      params,
      responseType: 'json'
    }).pipe(
      map(str => JSON.parse(str))
    ).subscribe(val => {
      this.costToReplace = val;
    });
  }
}
