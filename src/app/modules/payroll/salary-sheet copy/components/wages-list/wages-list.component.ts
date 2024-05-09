import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { PayrollReportRequest } from '../../../reports/models/payroll-reports.model';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { EmployeeSummaryComponent } from '../../../employee/components/employee-summary/employee-summary.component';
import { PayrollReportService } from '../../../reports/components/services/payroll-reports.service';
import { DecimalPipe } from '@angular/common';
import { PostingAccountsQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/posting-account.query';
import { ConfigurationSettingQuery } from 'src/app/modules/accounts/accounts-configuration/states/data-states/accounts-configuration.query';
import { WagesFooter, WagesRequest } from '../../models/wages.model';
import { WagesService } from '../../services/wages.service';

@Component({
  selector: 'app-wages-list',
  templateUrl: './wages-list.component.html',
  styleUrls: ['./wages-list.component.scss']
})

export class WagesListComponent implements OnInit {
  wagesList: WagesRequest[] = [];
  wagesFooter = new WagesFooter();
  monthYear: Date = new Date();

  selectAll = false;

  constructor(
    private _salarySheetService: WagesService,
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
    this.setBreadCrumb();
  }

  generateWages() {
    let request = new PayrollReportRequest();
    request.OrganizationId = this._authQuery.OrganizationId;
    request.OutletId = this._authQuery.OutletId;
    request.MonthOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[0]);
    request.YearOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[2]);
    this._hotToastservice.loading("Please wait for data is being fetched.");
    this._salarySheetService.generateWages(request).subscribe(
      (data: WagesRequest[]) => {
        if (data) {
          this._hotToastservice.close();
          this._hotToastservice.success("Data is feched succesfuly.");
          this.wagesList = data;
          this.footerValuesCalculation();
        } else {
          this._hotToastservice.close();
          this._hotToastservice.success("Please try again.");
        }
      }
    )
  }

  printWages() {
    let request = new PayrollReportRequest();
    request.OrganizationId = this._authQuery.OrganizationId;
    request.OutletId = this._authQuery.OutletId;
    request.MonthOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[0]);
    request.YearOf = parseInt(DateHelperService.getServerDateFormat(this.monthYear).split("/")[2]);
    this._hotToastservice.loading("Please wait for report is being generated.");
    this._salarySheetService.printWages(request).subscribe(
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

  saveWages() {
    if (this.wagesList.length > 0) {
      let salaryToSaveAndPost: WagesRequest[] = [];
      this.wagesList.filter(e => e.Selected == true).forEach(
        z => {
          z.WagesDate = DateHelperService.getServerDateFormat(z.WagesDate);
          salaryToSaveAndPost.push(z);
        }
      );
      this._hotToastservice.loading("Please wait for salary sheet is being saved.");
      this._salarySheetService.saveWages(salaryToSaveAndPost).subscribe(
        (res) => {
          if (res) {
            this._hotToastservice.close();
            this._hotToastservice.success("Data is saved succesfuly.");
            this.generateWages();
          } else {
            this._hotToastservice.close();
            this._hotToastservice.success("Please try again.");
            this.generateWages();
          }
        }
      );
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onRowSelect(event: any, salarySheet: WagesRequest) {
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

  openEmployeeDetail(salarySheet: WagesRequest) {
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

  printSlip(salarySheet: WagesRequest) {
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

  onSelectAllChange(event: any) {
    this.wagesList.forEach(r => r.Selected = event.checked);
  }

  onSingleSelectChange(event: any, salarySheet: WagesRequest) {
    salarySheet.Selected = event.checked;
  }

  private setBreadCrumb(): void {
    this._breadcrumbService.setBreadcrumbs([
      { label: 'Wages Calculation', routerLink: ['wages'] },
    ]);
  }

  postWages(event: any) {
    if (event) {
      this._confirmationService.confirm({
        message: 'Are you sure you want to post the Wages',
        accept: () => {
          this._messageService.clear();
          this.saveWages();
        }
        , reject: () => {
        }
      });
    }
  }

  deductionChange(wage: WagesRequest) {
    wage.NetPay = parseFloat((wage.WagesAmount - (wage.Installment + wage.Advance)).toFixed(2));
    this.footerValuesCalculation();
  }

  footerValuesCalculation() {
    this.wagesFooter.TotalWagesAmount = CommonHelperService.getSumofArrayPropert(this.wagesList, "WagesAmount") ?? 0;
    this.wagesFooter.TotalInstallment = CommonHelperService.getSumofArrayPropert(this.wagesList, "Installment") ?? 0;
    this.wagesFooter.TotalAdvance = CommonHelperService.getSumofArrayPropert(this.wagesList, "Advance") ?? 0;
  }
}
