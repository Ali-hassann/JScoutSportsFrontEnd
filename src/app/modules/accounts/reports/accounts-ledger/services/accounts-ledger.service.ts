import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialReportRequest } from '../../financial-reports/models/financial-report-model.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsLedgerService {

  constructor(
    private _http: HttpClient,
  ) { }

  public printAccountLedgerVoucher(printAccountLedgerRequest: FinancialReportRequest): Observable<any> {
    let url = `Reports/PrintAccountsLedger`;
    return this._http.post(url, printAccountLedgerRequest, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
