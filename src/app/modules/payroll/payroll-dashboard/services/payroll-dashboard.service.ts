import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeDashboardResponse, FinancialSummaryResponse } from '../models/payroll-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollDashboardService {
  constructor(private _http: HttpClient) { }

  public getEmployeeDashboardData(outletId: number): Observable<EmployeeDashboardResponse[]> {
    let url = `Dashboard/GetEmployeeDashboardData?outletId=${outletId}`;
    return this._http.get(url) as Observable<EmployeeDashboardResponse[]>;
  }

  public getAllowanceDashboardData(outletId: number): Observable<FinancialSummaryResponse[]> {
    let url = `Dashboard/GetAllowanceDashboardData?outletId=${outletId}`;
    return this._http.get(url) as Observable<FinancialSummaryResponse[]>;
  }

  public getLoanDashboardData(outletId: number): Observable<FinancialSummaryResponse[]> {
    let url = `Dashboard/GetLoanDashboardData?outletId=${outletId}`;
    return this._http.get(url) as Observable<FinancialSummaryResponse[]>;
  }
}
