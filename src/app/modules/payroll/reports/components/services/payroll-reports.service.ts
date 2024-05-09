import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { PayrollReportRequest } from '../../models/payroll-reports.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollReportService {

  constructor(
    private _authQuery: AuthQuery,
    private _http: HttpClient,
  ) {
  }

  employeeReport(request: PayrollReportRequest) {
    let url = `PayrollReports/GetEmployeesList`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }
  employeeAttendanceReport(request: PayrollReportRequest) {
    let url = `PayrollReports/GetAttendanceList`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }
  employeeLateHoursReport(request: PayrollReportRequest) {
    let url = `PayrollReports/GetLateHoursReport`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }
  printAttendanceRegisterReport(request: PayrollReportRequest) {
    let url = `PayrollReports/GetMonthlyAttendanceRegister`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }
  employeeOvertimeReport(request: PayrollReportRequest) {
    let url = `PayrollReports/GetOvertimeList`;
    return this._http.post(url, request, { observe: "response", responseType: "blob" });
  }

  departmentReport(employeId: number) {
    return this._http.get<PayrollReportRequest>(`Employee/GetEmployeeById?employeeId=${employeId}`)
  }
}
