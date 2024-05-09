import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalarySheet } from '../models/salary-sheet.model';
import { PayrollReportRequest } from '../../reports/models/payroll-reports.model';

@Injectable({
  providedIn: 'root'
})
export class SalarySheetService {

  constructor(private _http: HttpClient) { }

  public generateSalarySheet(request: PayrollReportRequest): Observable<SalarySheet[]> {
    let url = "Payroll/GenerateSalarySheet";
    return this._http.post<SalarySheet[]>(url, request) as Observable<SalarySheet[]>;
  }
  public saveSalarySheet(request: SalarySheet[], isToPost: boolean): Observable<SalarySheet[]> {
    let url = `Payroll/SaveSalarySheet?isToPost=${isToPost}`;
    return this._http.post<SalarySheet[]>(url, request) as Observable<SalarySheet[]>;
  }

  public printSalarySheet(request: PayrollReportRequest): Observable<any> {
    let url = "PayrollReports/GetSalarySheet";
    return this._http.post(url, request, { observe: "response", responseType: "blob" }) as Observable<any>;
  }

  public printSlip(request: SalarySheet): Observable<any> {
    let url = "PayrollReports/GetPaySlip";
    return this._http.post(url, request, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
