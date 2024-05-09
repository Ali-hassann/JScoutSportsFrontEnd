import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { map } from "rxjs/operators";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { DepartmentsRequest } from "src/app/modules/setting/department/models/department.model";
import { DepartmentQuery } from "src/app/modules/setting/department/states/departments.query";
import { PayrollReportRequest } from "../../models/payroll-reports.model";
import { PayrollReportService } from "../services/payroll-reports.service";
import { EmployeeBasicRequest } from "../../../employee/models/employee.model";
import { EmployeeQuery } from "../../../employee/states/employee.query";
import { SalaryTypeEnum } from "src/app/shared/enums/SalaryType";

@Component({
    selector: "app-pre-requisits-tab",
    templateUrl: "./pre-requisits-tab.component.html",
    styleUrls: ["./pre-requisits-tab.component.scss"],
})
export class PreRequisitReportTabComponent implements OnInit {

    departmentList: DepartmentsRequest[] = [];
    payrollReportRequest: PayrollReportRequest = new PayrollReportRequest();
    employeeList: EmployeeBasicRequest[] = [];
    departmentsId: number[] = [];
    employeeId: number[] = [];

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

    public printEmployeeReport() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });

        let request = new PayrollReportRequest();
        request.OrganizationId = this._authQuery.OrganizationId;
        request.OutletId = this._authQuery.OutletId;
        // request.FromDate = DateHelperService.getServerDateFormat(this.payrollReportRequest.FromDate);
        // request.ToDate = DateHelperService.getServerDateFormat(this.payrollReportRequest.ToDate);
        request.DepartmentIds = this.departmentsId.join(",");
        request.EmployeeIds = this.employeeId.join(",");
        request.SalaryType = SalaryTypeEnum.SalaryPerson;
        this._payrollReportService
            .employeeReport(request)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();
                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("prerequisitstab") as HTMLIFrameElement;
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