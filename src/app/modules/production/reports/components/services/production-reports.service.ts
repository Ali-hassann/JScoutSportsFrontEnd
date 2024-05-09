import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ProductionParameterRequest } from '../../../production-process/models/production-process.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionReportService {

  constructor(
    private _authQuery: AuthQuery,
    private _http: HttpClient,
  ) {
  }

  orderStatusReport(request: ProductionParameterRequest) {
    let url = `Reports/PrintOrderStatus`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }

  printArticleBalanceEmployeeWise(request: ProductionParameterRequest) {
    let url = `Reports/PrintArticleBalanceEmployeeWise`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }

  printOrderConsumptionReport(request: ProductionParameterRequest) {
    let url = `Reports/PrintOrderConsumption`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }
}
