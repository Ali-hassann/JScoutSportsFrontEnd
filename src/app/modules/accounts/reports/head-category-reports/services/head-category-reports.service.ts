import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HeadCategoryReportsCallResponse, PrintHeadCategoryReportsRequest } from '../models/head-category-reports.model';

@Injectable({
  providedIn: 'root'
})
export class HeadCategoryReportsService {

  constructor(
    private _http: HttpClient,
  ) { }

  public getHeadCategoryReportsList(filterRequest: PrintHeadCategoryReportsRequest): Observable<HeadCategoryReportsCallResponse> {
    let url = `Reports/GetHeadCategoryReport`;
    return this._http.post<HeadCategoryReportsCallResponse>(url, filterRequest);
  }
  public printHeadCategoryReports(printHeadCategoryReportsRequest: PrintHeadCategoryReportsRequest): any {
    let url = `Reports/PrintHeadCategoryLedger`;
    return this._http.post(url, printHeadCategoryReportsRequest, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
