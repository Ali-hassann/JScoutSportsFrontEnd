import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { DepartmentsRequest } from 'src/app/modules/setting/department/models/department.model';
import { DepartmentQuery } from 'src/app/modules/setting/department/states/departments.query';
import { Payroll } from 'src/app/shared/enums/rights.enum';
import { EmployeeBasicRequest } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeQuery } from '../../states/employee.query';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { PayrollReportService } from '../../../reports/components/services/payroll-reports.service';
import { PayrollReportRequest } from '../../../reports/models/payroll-reports.model';
import { environment } from 'src/environments/environment';
import { EmployeeSummaryComponent } from '../employee-summary/employee-summary.component';
import { SalaryTypeEnum } from 'src/app/shared/enums/SalaryType';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit {
  @Input() salaryType: number = -1; // used contracor and employee seperation

  // @Output() employee = new EventEmitter<EmployeeBasicRequest>();

  public employeeList: EmployeeBasicRequest[] = [];
  departmentList: DepartmentsRequest[] = [];
  rowsPerPageOptions = [5, 10, 30, 50, 100];
  departmentsId: number[] = [];
  Payroll = Payroll;
  defaultImage: string = 'assets/profile9.png'

  constructor(
    private _messageService: MessageService,
    public _dialogService: DialogService,
    private _employeeQuery: EmployeeQuery,
    private _confirmationService: ConfirmationService,
    private _employeeService: EmployeeService,
    private _breadcrumbService: AppBreadcrumbService,
    private _departmentQuery: DepartmentQuery,
    private _payrollReportService: PayrollReportService,
    private _fileViewerService: FileViewerService,
    private _authQuery: AuthQuery,
  ) {
    this._departmentQuery.departmentList$.subscribe(
      (data: DepartmentsRequest[]) => {
        this.departmentList = data;
      }
    );
  }

  private getPersonList() {
    this.employeeList = [];
    if (this.salaryType === SalaryTypeEnum.Wages) {
      this._employeeQuery.selectAllContractor().subscribe(empList => {
        empList.forEach(emp => {
          let employee: EmployeeBasicRequest = new EmployeeBasicRequest();
          CommonHelperService.mapSourceObjToDestination(emp, employee);
          if (emp.ImagePath) {
            employee.ImagePath = environment.baseImageIP + emp.ImagePath;
          }
          this.employeeList.push(employee);
        });
      });
    } else {
      this._employeeQuery.selectAllEmployees().subscribe(empList => {
        empList.forEach(emp => {
          let employee: EmployeeBasicRequest = new EmployeeBasicRequest();
          CommonHelperService.mapSourceObjToDestination(emp, employee);

          if (emp.ImagePath) {
            employee.ImagePath = environment.baseImageIP + emp.ImagePath;
          }
          this.employeeList.push(employee);
        });
      });
    }
  }

  private setBreadCrumb(): void {
    this._breadcrumbService.setBreadcrumbs([
      { label: `${this.salaryType === SalaryTypeEnum.Wages ? 'Contractor' : 'Employee'} List`, routerLink: [`${this.salaryType === SalaryTypeEnum.Wages ? 'contractors' : 'employees'}`] },
    ]);
  }

  public printEMployeeReport(): void {
    let payrollRequest: PayrollReportRequest = new PayrollReportRequest();
    payrollRequest.OutletId = this._authQuery.PROFILE.OutletId;
    payrollRequest.SalaryType = this.salaryType;

    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._payrollReportService
      .employeeReport(payrollRequest).subscribe(reportResponse => {
        if (reportResponse) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });
          this._fileViewerService.loadFileViewer(reportResponse);
        }
        else {
          this._messageService.clear();
          this._messageService.add({ severity: 'info', summary: 'Info', detail: 'No record found for selected criteria', life: 3000 });
        }
      });
  }

  ngOnInit() {
    this.setBreadCrumb();
    this.getPersonList();
  }

  getEmployeeOfSelectedDepartment() {
    if (this.departmentList.length > 0) {
      this._employeeQuery.getEmployeeOfSelectedDepartment(this.departmentsId, this.salaryType).subscribe(
        (x: EmployeeBasicRequest[]) => {
          this.employeeList = x;
        }
      );
    }
  }

  public addEmployeeDialog(employee: EmployeeBasicRequest = new EmployeeBasicRequest()): void {
    employee.SalaryType = this.salaryType;
    let dialogRef = this._dialogService.open(AddEmployeeComponent, {
      header: `${employee?.EmployeeId ?? 0 > 0 ? 'Edit' : 'Add'} ${this.salaryType === SalaryTypeEnum.Wages ? "Contractor" : "Employee"}`,
      data: employee,
      width: '80%',
    });
    dialogRef.onClose.subscribe(res => {
      res ? this.getPersonList() : "";
    })
  }

  deleteEmployee(employee: EmployeeBasicRequest) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete employee?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._employeeService.deleteEmployee(employee.EmployeeId).subscribe(
          (x: boolean) => {
            if (x) {
              this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted Successfully', life: 3000 });
              this._employeeQuery.removeEmployeeById(employee.EmployeeId);
            }
          }
        );
      },
      reject: () => {
      },
      key: 'employeeList'
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  viewEmployee(employee: EmployeeBasicRequest) {
    let dialogRef = this._dialogService.open(EmployeeSummaryComponent, {
      header: `${employee.EmployeeName} Detail`,
      data: {
        EmployeeName: employee.EmployeeName,
        EmployeeId: employee.EmployeeId,
        salaryType: this.salaryType
      },
      height: "100%",
      width: "100%",
      maximizable: true
    });
  }
}
