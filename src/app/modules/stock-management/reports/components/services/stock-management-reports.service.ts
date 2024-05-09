import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { StockManagementReportRequest } from '../../models/inventory-reports.model';

@Injectable({
  providedIn: 'root'
})
export class StockManagementReportService {

  constructor(
    private _authQuery: AuthQuery,
    private _http: HttpClient,
  ) {
  }

  itemLedgerReport(request: StockManagementReportRequest) {
    let url = `Reports/PrintItemsLedger`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }

  verderLedgerReport(request: StockManagementReportRequest) {
    let url = `Reports/PrintPartyLedger`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }

  printDailyTransactions(request: StockManagementReportRequest) {
    let url = `Reports/PrintDailyTransactions`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }

  printStockSummary(request: StockManagementReportRequest) {
    let url = `Reports/PrintStockSummary`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }
}
