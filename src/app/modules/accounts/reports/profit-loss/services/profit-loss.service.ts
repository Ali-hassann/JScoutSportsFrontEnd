import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialReportRequest } from '../../financial-reports/models/financial-report-model.model';
import { ProfitLossRequest } from '../models/profit-loss.model';

@Injectable({
  providedIn: 'root'
})
export class ProfitLossService {

  constructor(private _http: HttpClient,) { }

  public printprofitLossSheet(ProfitLoss: FinancialReportRequest): Observable<any> {
    let url = `Reports/ProfitAndLoss`;
    return this._http.post(url, ProfitLoss, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
