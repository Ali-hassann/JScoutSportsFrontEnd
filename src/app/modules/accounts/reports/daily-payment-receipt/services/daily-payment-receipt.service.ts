import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionReportRequest } from '../../transaction-reports/transaction-report-model.model';

@Injectable({
  providedIn: 'root'
})
export class DailyPaymentReceiptService {

  constructor(private _http: HttpClient) { }

  public printDailyPaymentReceiptReport(dailypaymentReceiptReport: TransactionReportRequest): Observable<any> {
    let url = `Reports/PrintDailyPaymentReceipt`;
    return this._http.post(url, dailypaymentReceiptReport, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
