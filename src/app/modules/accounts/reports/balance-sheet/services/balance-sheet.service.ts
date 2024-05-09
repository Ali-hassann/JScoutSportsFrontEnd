import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialReportRequest } from '../../financial-reports/models/financial-report-model.model';

@Injectable({
  providedIn: 'root'
})
export class BalanceSheetService {

  constructor(private _http: HttpClient,) { }

  public printBalanceSheet(BalanceSheet: FinancialReportRequest): Observable<any> {
    let url = `Reports/PrintBalanceSheet`;
    return this._http.post(url, BalanceSheet, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
