import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductionParameterRequest, ProductionProcessRequest } from '../models/production-process.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionProcessService {

  constructor(
    private _http: HttpClient,
  ) { }

  saveProductionProcess(request: ProductionProcessRequest[]): Observable<boolean> {
    const url = `Production/SaveProductionProcess`;
    return this._http.post(url, request) as Observable<boolean>;
  }

  saveReceiveProcessList(request: ProductionProcessRequest[]): Observable<boolean> {
    const url = `Production/SaveReceiveProcessList`;
    return this._http.post(url, request) as Observable<boolean>;
  }

  getIssuanceListByOrder(request: ProductionParameterRequest): Observable<ProductionProcessRequest[]> {
    const url = `Production/GetIssuanceListByOrder`;
    return this._http.post(url, request) as Observable<ProductionProcessRequest[]>;
  }

  getReceiveListByOrder(request: ProductionParameterRequest): Observable<ProductionProcessRequest[]> {
    const url = `Production/GetReceiveListByOrder`;
    return this._http.post(url, request) as Observable<ProductionProcessRequest[]>;
  }

  removeProductionProcess(productionProcessId: number): Observable<boolean> {
    const url = `Production/RemoveProductionProcess?productionProcessId=${productionProcessId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  removeProductionProcessByIssueNo(productionProcessId: number): Observable<boolean> {
    const url = `Production/RemoveProductionProcessByIssueNo?issueNo=${productionProcessId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getProductionDetailById(productionProcessId: number): Observable<ProductionProcessRequest[]> {
    const url = `Production/GetProductionDetailById?productionProcessId=${productionProcessId}`;
    return this._http.get(url) as Observable<ProductionProcessRequest[]>;
  }

  getProductionProcessList(request: ProductionParameterRequest): Observable<ProductionProcessRequest[]> {
    const url = `Production/GetProductionProcessList`;
    return this._http.post<ProductionProcessRequest[]>(url, request) as Observable<ProductionProcessRequest[]>;
  }

  getReceivingProcessList(request: ProductionParameterRequest): Observable<ProductionProcessRequest[]> {
    const url = `Production/GetReceivingProcessList`;
    return this._http.post<ProductionProcessRequest[]>(url, request) as Observable<ProductionProcessRequest[]>;
  }

  getProcessListByIssueNo(issueNo: number): Observable<ProductionProcessRequest[]> {
    const url = `Production/GetProcessListByIssueNo?issueNo=${issueNo}`;
    return this._http.get<ProductionProcessRequest[]>(url) as Observable<ProductionProcessRequest[]>;
  }

  printIssueSlip(request: ProductionParameterRequest): Observable<any> {
    let url = `Reports/PrintIssueSlip`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }
}
