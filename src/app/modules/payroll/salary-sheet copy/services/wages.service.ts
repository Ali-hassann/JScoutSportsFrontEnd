import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PayrollReportRequest } from '../../reports/models/payroll-reports.model';
import { WagesRequest } from '../models/wages.model';

@Injectable({
  providedIn: 'root'
})
export class WagesService {

  constructor(private _http: HttpClient) { }

  public generateWages(request: PayrollReportRequest): Observable<WagesRequest[]> {
    let url = "Payroll/GenerateWages";
    return this._http.post<WagesRequest[]>(url, request) as Observable<WagesRequest[]>;
  }

  public getWagesApprovalList(request: PayrollReportRequest): Observable<WagesRequest[]> {
    let url = "Payroll/GetWagesApprovalList";
    return this._http.post<WagesRequest[]>(url, request) as Observable<WagesRequest[]>;
  }

  public postWages(request: WagesRequest): Observable<number> {
    let url = `Payroll/PostWages`;
    return this._http.post<number>(url, request) as Observable<number>;
  }

  public saveWages(request: WagesRequest[]): Observable<boolean> {
    let url = `Payroll/SaveWages`;
    return this._http.post<boolean>(url, request) as Observable<boolean>;
  }

  public printWages(request: PayrollReportRequest): Observable<any> {
    let url = "PayrollReports/GetWages";
    return this._http.post(url, request, { observe: "response", responseType: "blob" }) as Observable<any>;
  }

  public printSlip(request: WagesRequest): Observable<any> {
    let url = "PayrollReports/GetPaySlip";
    return this._http.post(url, request, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
