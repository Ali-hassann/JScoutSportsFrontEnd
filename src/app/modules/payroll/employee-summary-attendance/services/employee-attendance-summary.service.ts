import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttendanceResponse } from '../../attendance/models/attendance.model';
import { EmployeePayrollRequest } from '../../employee/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAttendanceSummaryService {

  constructor(private _http: HttpClient) { }
  getEmployeeAttendanceHistory(employeeAttendanceSummaryRequest: EmployeePayrollRequest) {
    return this._http.post<AttendanceResponse[]>
      (`Attendance/GetAttendanceSummaryAndHistory`, employeeAttendanceSummaryRequest);
  }
}
