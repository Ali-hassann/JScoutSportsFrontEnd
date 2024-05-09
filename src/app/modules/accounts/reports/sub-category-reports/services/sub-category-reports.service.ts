import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrintSubCategoryReportsRequest, SubCategoryLReportsCallResponse } from '../models/sub-category-reports.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryReportsService {


  constructor(
    private _http: HttpClient,
  ) { }

  public getSubCategoryReportsList(filterRequest: PrintSubCategoryReportsRequest): Observable<SubCategoryLReportsCallResponse> {
    let url = `Reports/GetSubCategoryReport`;
    return this._http.post<SubCategoryLReportsCallResponse>(url, filterRequest);
  }
  public printSubCategoryReports(printSubCategoryReportsRequest: PrintSubCategoryReportsRequest): Observable<any> {
    let url = `Reports/PrintSubCategoryLedger`;
    return this._http.post(url, printSubCategoryReportsRequest, { responseType: "blob", observe: "response" }) as Observable<any>;
  }
}
