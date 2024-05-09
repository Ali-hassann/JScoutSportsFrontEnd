import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionReportRequest } from '../../transaction-reports/transaction-report-model.model';

@Injectable({
  providedIn: 'root'
})
export class DailyTransactionReportService {

  constructor(private _http: HttpClient) { }

  public printDailyTransactionReport(dailyTransactionReport: TransactionReportRequest): Observable<any> {
    let url = `Reports/PrintDailyVouchers`;
    return this._http.post(url, dailyTransactionReport, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
