import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { AttendanceResponse } from '../../../attendance/models/attendance.model';
import { EmployeePayrollRequest } from '../../../employee/models/employee.model';
import { EmployeeAttendanceSummaryService } from '../../services/employee-attendance-summary.service';

@Component({
  selector: 'app-employee-attendance-summary',
  templateUrl: './employee-attendance-summary.component.html',
  styleUrls: ['./employee-attendance-summary.component.scss']
})
export class EmployeeAttendanceSummaryComponent implements OnInit {

  @Input() EmployeeId: number = 0;
  employeePayrollRequest: EmployeePayrollRequest = new EmployeePayrollRequest()
  employeeAttendanceList: AttendanceResponse[] = [];

  constructor(
    private _messageService: MessageService,
    private _employeeLoanService: EmployeeAttendanceSummaryService,
    private _authQuery: AuthQuery,

  ) { }





  rowsPerPageOptions = [5, 10, 20];

  ngOnInit() {

  }


  submit() {
    let request: EmployeePayrollRequest = new EmployeePayrollRequest();
    request.FromDate = DateHelperService.getServerDateFormat(this.employeePayrollRequest.FromDate);
    request.ToDate = DateHelperService.getServerDateFormat(this.employeePayrollRequest.ToDate);
    request.OrganizationId = this._authQuery.PROFILE.OrganizationId;
    request.OutletId = this._authQuery.PROFILE.OutletId;
    request.EmployeeIds = this.EmployeeId.toString();
    this._employeeLoanService.getEmployeeAttendanceHistory(request).subscribe(
      (data: AttendanceResponse[]) => {
        this.employeeAttendanceList = data;
      }
    );
  }





  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


}
