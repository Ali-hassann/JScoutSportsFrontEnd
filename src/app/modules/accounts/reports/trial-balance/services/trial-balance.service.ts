import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialReportRequest } from '../../financial-reports/models/financial-report-model.model';

@Injectable({
  providedIn: 'root'
})
export class TrialBalanceService {

  constructor(private _http: HttpClient,) { }

  public printTrailBalance(TrailBalance: FinancialReportRequest): Observable<any> {
    let url = `Reports/PrintTrialBalance`;
    return this._http.post(url, TrailBalance, { responseType: "blob", observe: "response" }) as Observable<any>;
  }

  public printSubAccountReport(TrailBalance: FinancialReportRequest): Observable<any> {
    let url = `Reports/PrintSubCategoryLedger`;
    return this._http.post(url, TrailBalance, { responseType: "blob", observe: "response" }) as Observable<any>;
  }
}
