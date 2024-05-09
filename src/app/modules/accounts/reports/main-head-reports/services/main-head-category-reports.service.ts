import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MainHeadReportsCallResponse, PrintMainHeadReportsRequest } from '../models/main-head-category.model';

@Injectable({
  providedIn: 'root'
})
export class MainHeadCategoryReportsService {

  constructor(
    private _http: HttpClient,
  ) { }

  public getMainHeadReportsList(filterRequest: PrintMainHeadReportsRequest): Observable<MainHeadReportsCallResponse> {
    let url = `Reports/GetMainHeadReport`;
    return this._http.post<MainHeadReportsCallResponse>(url, filterRequest);
  }
  public printMainHeadReports(printMainHeadReportsRequest: PrintMainHeadReportsRequest): Observable<any> {
    let url = `Reports/PrintMainHeadLedger`;
    return this._http.post(url, printMainHeadReportsRequest, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
