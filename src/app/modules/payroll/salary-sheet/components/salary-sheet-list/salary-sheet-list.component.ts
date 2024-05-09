import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { SalarySheet, SalarySheetFooter } from '../../models/salary-sheet.model';
import { SalarySheetService } from '../../services/salary-sheet.service';
import { PayrollReportRequest } from '../../../reports/models/payroll-reports.model';
import { Payroll } from 'src/app/shared/enums/rights.enum';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { EmployeeSummaryComponent } from '../../../employee/components/employee-summary/employee-summary.component';
import { PayrollReportService } from '../../../reports/components/services/payroll-reports.service';
import { DecimalPipe } from '@angular/common';
import { PostingAccountsRequest } from 'src/app/modules/accounts/charts-of-accounts/models/posting-accounts.model';
import { PostingAccountsQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/posting-account.query';
import { SubCategoryQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/sub-category.query';
import { ConfigurationSettingQuery } from 'src/app/modules/accounts/accounts-configuration/states/data-states/accounts-configuration.query';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';

@Component({
  selector: 'app-salary-sheet-list',
  templateUrl: './salary-sheet-list.component.html',
  styleUrls: ['./salary-sheet-list.component.scss']
})
export class SalarySheetListComponent implements OnInit {

  salarySheetList: SalarySheet[] = [];
  salarySheetFooter = new SalarySheetFooter();
  monthYear: Date = new Date();
  Payroll = Payroll;
  isPosted: boolean = false;
  isAlreadyPosted: boolean = false;
  paidOvertimeAmount = 0;
  LoanActions = [
    "Adjust Loan",
  ]
  departmentTypeId = 1;
  departmentType = [
    { name: 'Production', value: 1 },
    { name: 'Official Staff', value: 2 },
    { name: 'Directors', value: 3 },]

  selectAll = false;
  backsList: PostingAccountsRequest[] = [];

  constructor(
    private _salarySheetService: SalarySheetService,
    private _authQuery: AuthQuery,
    private _breadcrumbService: AppBreadcrumbService,
    private _fileViewerService: FileViewerService,
    public _hotToastservice: HotToastService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService,
    private _payrollReportService: PayrollReportService,
    private _dialogService: DialogService,
    private _postingAccountsQuery: PostingAccountsQuery,
    private _configurationSettingQuery: ConfigurationSettingQuery,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    let banksId = 0;
    this._configurationSettingQuery.configurationSetting$
      .subscribe(data => {
        banksId = data.find(u => u.AccountName === "Banks")?.AccountValue ?? 0
      });
    this._postingAccountsQuery.activePostingAccountsList$
      .subscribe(data => { this.backsList = data.filter(r => r.SubCategoriesId == banksId) });
    this.setBreadCrumb();
  }

  clearBank(salarySheet: SalarySheet) {
    salarySheet.BankAccountId = 0;
    this.footerValuesCalculation();
  }

  changeBank() {
    this.footerValuesCalculation();
  }

  generateSalarySheet() {
    let request = new PayrollReportRequest();
    request.OrganizationId = this._authQuery.OrganizationId;
    request.OutletId = this._authQuery.OutletId;
    request.MonthOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[0]);
    request.YearOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[2]);
    request.DepartmentTypeId = this.departmentTypeId;
    this._hotToastservice.loading("Please wait for data is being fetched.");
    this._salarySheetService.generateSalarySheet(request).subscribe(
      (data: SalarySheet[]) => {
        if (data) {
          this._hotToastservice.close();
          this._hotToastservice.success("Data is feched succesfuly.");
          this.salarySheetList = [];
          this.salarySheetList = data;
          this.footerValuesCalculation();
          this.isAlreadyPosted = this.salarySheetList.filter(r => r.IsPosted == true).length == this.salarySheetList.length;
          this.isPosted = this.isAlreadyPosted;
        } else {
          this._hotToastservice.close();
          this._hotToastservice.success("Please try again.");
        }
      }
    )
  }

  printSalarySheet() {
    let request = new PayrollReportRequest();
    request.OrganizationId = this._authQuery.OrganizationId;
    request.OutletId = this._authQuery.OutletId;
    request.MonthOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[0]);
    request.YearOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[2]);
    request.DepartmentTypeId = this.departmentTypeId;
    this._hotToastservice.loading("Please wait for report is being generated.");
    this._salarySheetService.printSalarySheet(request).subscribe(
      (data) => {
        if (data) {
          this._hotToastservice.close();
          this._hotToastservice.success("Data is feched succesfuly.");
          this._fileViewerService.loadFileViewer(data);
        } else {
          this._hotToastservice.close();
          this._hotToastservice.success("Please try again.");
        }
      }
    )
  }

  saveSalarySheet() {
    if (this.salarySheetList.length > 0) {
      let salaryToSaveAndPost = this.salarySheetList.filter(e => e.IsPosted == false);
      this._hotToastservice.loading("Please wait for salary sheet is being saved.");
      if (this.isPosted) {
        salaryToSaveAndPost = this.salarySheetList.filter(r => r.IsPosted == false && r.Selected == true);
        salaryToSaveAndPost.forEach(c => {
          c.IsPosted = this.isPosted;
        });
      }

      this._salarySheetService.saveSalarySheet(salaryToSaveAndPost, this.isPosted).subscribe(
        (data: SalarySheet[]) => {
          if (data) {
            this._hotToastservice.close();
            this._hotToastservice.success("Data is saved succesfuly.");
            this.generateSalarySheet();
          } else {
            this._hotToastservice.close();
            this._hotToastservice.success("Please try again.");
            this.generateSalarySheet();
          }
        }
      )
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onRowSelect(event: any, salarySheet: SalarySheet) {
    switch (event.data) {
      case 'EmployeeDetail':
        this.openEmployeeDetail(salarySheet);
        break;
      case 'Slip':
        this.printSlip(salarySheet)
        break;
      default:
        break;
    }
  }

  openEmployeeDetail(salarySheet: SalarySheet) {
    let dialogRef = this._dialogService.open(
      EmployeeSummaryComponent,
      {
        header: "Employee Detail",
        width: "100%",
        height: "100%",
        data: {
          EmployeeName: salarySheet.EmployeeName,
          EmployeeId: salarySheet.EmployeeId
        },
        maximizable: true
      }
    );
  }

  printSlip(salarySheet: SalarySheet) {
    this._hotToastservice.loading("Please wait for report is being generated.");
    this._salarySheetService.printSlip(salarySheet).subscribe(
      (data) => {
        if (data) {
          this._hotToastservice.close();
          this._hotToastservice.success("Data is feched succesfuly.");
          this._fileViewerService.loadFileViewer(data);
        } else {
          this._hotToastservice.close();
          this._hotToastservice.success("Please try again.");
        }
      }
    )
  }

  printAttendanceOvertime(isAttendance: boolean, employeeId: number) {
    let request = new PayrollReportRequest();
    request.OrganizationId = this._authQuery.OrganizationId;
    request.OutletId = this._authQuery.OutletId;
    request.MonthOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[0]);
    request.YearOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[2]);
    request.DepartmentIds = '';
    request.EmployeeIds = employeeId.toString();
    request.DepartmentTypeId = this.departmentTypeId;
    this._hotToastservice.loading("Please wait for report is being generated.");
    if (isAttendance) {
      this._payrollReportService.employeeLateHoursReport(request).subscribe(
        (data) => {
          if (data) {
            this._hotToastservice.close();
            this._hotToastservice.success("Data is feched succesfuly.");
            this._fileViewerService.loadFileViewer(data);
          } else {
            this._hotToastservice.close();
            this._hotToastservice.success("Please try again.");
          }
        }
      )
    } else {
      this._payrollReportService.employeeOvertimeReport(request).subscribe(
        (data) => {
          if (data) {
            this._hotToastservice.close();
            this._hotToastservice.success("Data is feched succesfuly.");
            this._fileViewerService.loadFileViewer(data);
          } else {
            this._hotToastservice.close();
            this._hotToastservice.success("Please try again.");
          }
        }
      )
    }
  }

  printAttendanceRegister(employeeId: number) {
    let request = new PayrollReportRequest();
    request.OrganizationId = this._authQuery.OrganizationId;
    request.OutletId = this._authQuery.OutletId;
    request.MonthOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[0]);
    request.YearOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[2]);
    request.DepartmentIds = '';
    request.EmployeeIds = employeeId.toString();
    request.DepartmentTypeId = this.departmentTypeId;
    this._hotToastservice.loading("Please wait for report is being generated.");

    this._payrollReportService.printAttendanceRegisterReport(request).subscribe(
      (data) => {
        if (data) {
          this._hotToastservice.close();
          this._hotToastservice.success("Data is feched succesfuly.");
          this._fileViewerService.loadFileViewer(data);
        } else {
          this._hotToastservice.close();
          this._hotToastservice.success("Please try again.");
        }
      }
    );
  }

  private setBreadCrumb(): void {
    this._breadcrumbService.setBreadcrumbs([
      { label: 'Salary List', routerLink: ['salary-sheet'] },
    ]);
  }

  postSalarySheet(event: any) {
    if (event) {
      this._confirmationService.confirm({
        message: 'Are you sure you want to post the salary sheet?',
        accept: () => {
          this._messageService.clear();
          this.isPosted = event;
          this.isAlreadyPosted = event;
          this.saveSalarySheet();
        }
        , reject: () => {
          this.isPosted = false;
        }
      });
    }
  }

  deductionChange(employee: SalarySheet) {
    employee.NetPay = parseFloat((employee.GrossPay - (employee.Installment + employee.Advance + employee.OthersDeduction + employee.IncomeTax)).toFixed(2));
    this.footerValuesCalculation();
  }

  additionChange(employee: SalarySheet) {
    employee.GrossPay = Number(((employee.TotalWorkingHoursCount * employee.PerHourRate)
      + ((employee.TotalOverTimeHours - employee.TotalLateHours) > 0 ?
        (employee.TotalOverTimeHours * employee.OverTimeRate - (employee.TotalLateHours * employee.OverTimeRate - employee.TotalLateHours * employee.PerHourRate))
        :
        (employee.TotalOverTimeHours - employee.TotalLateHours) < 0 ? employee.TotalOverTimeHours * employee.PerHourRate : 0)
      + employee.Allowance
      + employee.OthersAddition
      + (employee.TotalAbsents > 0 && (employee.TotalPresents > 10 || employee.TotalPaidLeaves > 10) ? employee.AbsentAmount : 0)
      + (employee.TotalPresents > 6 || employee.TotalPaidLeaves > 6 ? (employee.TotalSundays * employee.PerDayRate) : 0)).toFixed(2));

    employee.NetPay = parseFloat((employee.GrossPay - (employee.Installment + employee.Advance + employee.OthersDeduction + employee.IncomeTax)).toFixed(2));
    this.footerValuesCalculation();
  }

  onSelectAllChange(event: any) {
    this.salarySheetList.filter(c => c.IsPosted == false).forEach(r => r.Selected = event.checked);
  }

  onSingleSelectChange(event: any, salarySheet: SalarySheet) {
    if (salarySheet.IsPosted == false) {
      salarySheet.Selected = event.checked;
    }
  }

  footerValuesCalculation() {
    var paidOvertimeList = this.salarySheetList.filter(d => d.OvertimeAmount > 0);
    this.paidOvertimeAmount = CommonHelperService.getSumofArrayPropert(paidOvertimeList, "OvertimeAmount");
    this.salarySheetFooter.TotalSalaryAmount = CommonHelperService.getSumofArrayPropert(this.salarySheetList, "SalaryAmount") ?? 0;
    this.salarySheetFooter.TotalOverTimeAmount = CommonHelperService.getSumofArrayPropert(this.salarySheetList, "OvertimeAmount") ?? 0;
    this.salarySheetFooter.TotalAllowance = CommonHelperService.getSumofArrayPropert(this.salarySheetList, "Allowance") ?? 0;
    this.salarySheetFooter.TotalGrossPay = parseFloat((CommonHelperService.getSumofArrayPropert(this.salarySheetList, "GrossPay") ?? 0).toFixed(2));
    this.salarySheetFooter.TotalInstallment = CommonHelperService.getSumofArrayPropert(this.salarySheetList, "Installment") ?? 0;
    this.salarySheetFooter.TotalAdvance = CommonHelperService.getSumofArrayPropert(this.salarySheetList, "Advance") ?? 0;
    this.salarySheetFooter.TotalIncomeTax = CommonHelperService.getSumofArrayPropert(this.salarySheetList, "IncomeTax") ?? 0;
    this.salarySheetFooter.TotalOthersDeduction = CommonHelperService.getSumofArrayPropert(this.salarySheetList, "OthersDeduction") ?? 0;
    this.salarySheetFooter.TotalNetPay = parseFloat((CommonHelperService.getSumofArrayPropert(this.salarySheetList, "NetPay") ?? 0).toFixed(2));
    this.salarySheetFooter.TotalCashNetPay = parseFloat((CommonHelperService.getSumofArrayPropert(this.salarySheetList.filter(r => r.BankAccountId == 0), "NetPay") ?? 0).toFixed(2));
    this.salarySheetFooter.TotalBankNetPay = parseFloat((CommonHelperService.getSumofArrayPropert(this.salarySheetList.filter(r => r.BankAccountId > 0), "NetPay") ?? 0).toFixed(2));
  }
}
