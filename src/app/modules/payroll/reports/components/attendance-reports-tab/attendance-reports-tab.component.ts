import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { map } from "rxjs/operators";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { DepartmentsRequest } from "src/app/modules/setting/department/models/department.model";
import { DepartmentQuery } from "src/app/modules/setting/department/states/departments.query";
import { DateHelperService } from "src/app/shared/services/date-helper.service";
import { PayrollReportRequest } from "../../models/payroll-reports.model";
import { PayrollReportService } from "../services/payroll-reports.service";
import { EmployeeBasicRequest } from "../../../employee/models/employee.model";
import { EmployeeQuery } from "../../../employee/states/employee.query";

@Component({
    selector: "app-attendance-reports-tab",
    templateUrl: "./attendance-reports-tab.component.html",
    styleUrls: ["./attendance-reports-tab.component.scss"],
})
export class AttendanceReportTabComponent implements OnInit {
    departmentList: DepartmentsRequest[] = [];
    payrollReportRequest: PayrollReportRequest = new PayrollReportRequest();
    employeeList: EmployeeBasicRequest[] = [];
    departmentsId: number[] = [];
    departmentTypeId: number = 1;
    employeeId: number[] = [];
    month: Date = new Date();

    departmentType = [
        { name: 'Production', value: 1 },
        { name: 'Official Staff', value: 2 }]

    constructor(
        private _payrollReportService: PayrollReportService,
        private _authQuery: AuthQuery,
        private _messageService: MessageService,
        private _departmentQuery: DepartmentQuery,
        private _EmployeeQuery: EmployeeQuery,
    ) {
    }

    ngOnInit(): void {
        this._departmentQuery.departmentList$.subscribe(
            (data: DepartmentsRequest[]) => {
                this.departmentList = data;
            }
        );
        this._EmployeeQuery.employeeList$.subscribe(
            (data: EmployeeBasicRequest[]) => {
                this.employeeList = data;
            }
        );
    }

    public printEmployeeAttendanceReport() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        let request = new PayrollReportRequest();
        request.OrganizationId = this._authQuery.OrganizationId;
        request.OutletId = this._authQuery.OutletId;
        request.DepartmentTypeId = this.departmentTypeId;
        request.MonthOf = parseInt(DateHelperService.getServerDateFormat(this.month).split("/")[0]);
        request.YearOf = parseInt(DateHelperService.getServerDateFormat(this.month).split("/")[2]);
        request.DepartmentIds = this.departmentsId.join(",");
        request.EmployeeIds = this.employeeId.join(",");
        this._payrollReportService
            .employeeAttendanceReport(request)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();

                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("attendance") as HTMLIFrameElement;
                        frame.src = window.URL.createObjectURL(blob);
                    } else {
                        this._messageService.clear();
                        this._messageService.add({
                            severity: 'info',
                            summary: 'Message',
                            detail: 'No record found for selected criteria',
                            life: 3000
                        });
                    }
                })
            )
            .subscribe();
    }

    public printAttendanceRegisterReport() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        let request = new PayrollReportRequest();
        request.OrganizationId = this._authQuery.OrganizationId;
        request.OutletId = this._authQuery.OutletId;
        request.MonthOf = parseInt(DateHelperService.getServerDateFormat(this.month).split("/")[0]);
        request.YearOf = parseInt(DateHelperService.getServerDateFormat(this.month).split("/")[2]);
        request.DepartmentIds = this.departmentsId.join(",");
        request.EmployeeIds = this.employeeId.join(",");
        this._payrollReportService
            .printAttendanceRegisterReport(request)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();

                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("attendance") as HTMLIFrameElement;
                        frame.src = window.URL.createObjectURL(blob);
                    } else {
                        this._messageService.clear();
                        this._messageService.add({
                            severity: 'info',
                            summary: 'Message',
                            detail: 'No record found for selected criteria',
                            life: 3000
                        });
                    }
                })
            )
            .subscribe();
    }

}