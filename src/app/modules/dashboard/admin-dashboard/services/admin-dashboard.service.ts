import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminDashboardDetailRequest, DashboardDetailRequest, DashboardMonthWiseProfitLossRequest, DashboardMonthWiseProfitLossResponse, dashboardTransactionHistory, DashboardTransactionHistoryRequest as DashboardTransactionHistoryRequest, TrialBalanceDataResponse } from '../models/admin-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(
    private _http: HttpClient,
  ) { }

  public getDashboardDetailByOutletId(request: DashboardDetailRequest): Observable<AdminDashboardDetailRequest> {
    let url = `Dashboard/DashBoardDetail`;
    return this._http.post<AdminDashboardDetailRequest>(url, request) as Observable<AdminDashboardDetailRequest>;
  }
  public getDashboardMonthWiseProfitLossSummary(request: DashboardMonthWiseProfitLossRequest): Observable<DashboardMonthWiseProfitLossResponse[]> {
    let url = `Dashboard/DashboardMonthWiseProfitLossSummary`;
    return this._http.post<DashboardMonthWiseProfitLossResponse[]>(url, request) as Observable<DashboardMonthWiseProfitLossResponse[]>;
  }
  public getLastTransactionHistory(request: DashboardTransactionHistoryRequest): Observable<dashboardTransactionHistory[]> {
    let url = `Dashboard/GetLatestPostVouchers`;
    return this._http.post<dashboardTransactionHistory[]>(url, request) as Observable<dashboardTransactionHistory[]>;
  }
  public getUnpostedVoucherCount(OrganizationId: number, OutletId: number): Observable<number> {
    let url = `Vouchers/GetUnPostedVouchersCount?OrganizationId=${OrganizationId}&OutletId=${OutletId}`;
    return this._http.get<number>(url) as Observable<number>;
  }
  public getTrialBalanceData(OutletId: number): Observable<TrialBalanceDataResponse[]> {
    let url = `Dashboard/GetTrialBalanceData?outletId=${OutletId}`;
    return this._http.get<TrialBalanceDataResponse[]>(url) as Observable<TrialBalanceDataResponse[]>;
  }
}
