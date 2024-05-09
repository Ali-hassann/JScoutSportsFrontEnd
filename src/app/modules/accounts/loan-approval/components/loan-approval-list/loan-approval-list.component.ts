import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { EmloyeeLoanService } from '../../../../payroll/loan/services/emloyee-loan.service';
import { EmployeeLoanRequest } from '../../../../payroll/loan/models/employee-loan.model';
import { AuthQuery } from '../../../../common/auth/states/auth.query';
import { VoucherService } from '../../../voucher/services/voucher.service';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { FinancialReportResolverResolver } from '../../../reports/financial-reports/financial-report-resolver.resolver';

@Component({
  selector: 'app-loan-approval-list',
  templateUrl: './loan-approval-list.component.html',
  styleUrls: ['./loan-approval-list.component.scss']
})
export class LoanApprovalListComponent implements OnInit {

  loanList: EmployeeLoanRequest[] = [];
  selectedLoanRequest: EmployeeLoanRequest = new EmployeeLoanRequest();

  visible: boolean = false;
  isToShowApproveBtn: boolean = false;
  selectedCount: number = 0;
  constructor(
    private _messageService: MessageService,
    private _voucherService: VoucherService,
    private _fileViewerService: FileViewerService,
    private _employeeLoanService: EmloyeeLoanService,
    public _dialogService: DialogService,
    private _authService: AuthQuery,
    private _financialReportResolverResolver: FinancialReportResolverResolver
  ) { }

  ngOnInit() {
    this.getLoanList();
  }

  private getLoanList() {
    this._employeeLoanService.getApprovalLoanList(this._authService.OutletId).subscribe(
      (data: EmployeeLoanRequest[]) => {
        if (data) {
          this.loanList = data;
        }
      }
    );
  }

  approveLoan(loan: EmployeeLoanRequest) {
    this.selectedLoanRequest = loan;
    this.visible = true;
  }

  createVoucher(isToCreateVoucher: boolean) {
    this.visible = false;
    this.selectedLoanRequest.IsApproved = true;
    this.selectedLoanRequest.IsToCreateVoucher = isToCreateVoucher;
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait loan is being approved', sticky: true });
    this._employeeLoanService.updateEmployeeLoan(this.selectedLoanRequest).subscribe(res => {
      this._messageService.clear();
      if (res.VoucherMasterId > 0) {
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Loan approved successfully', life: 3000 });

        //print voucher
        this.printVoucher(res.VoucherMasterId);
        //
      }
      // Refreshing Posting Accounts
      this._financialReportResolverResolver.resolve().subscribe();
      this.getLoanList();
    });
  }

  createMultipleVoucher() {
    var listToApprove = this.loanList.filter(r => r.Selected == true).map(e => { e.IsApproved = true; e.IsToCreateVoucher = true; return e });
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait loan is being approved', sticky: true });
    this._employeeLoanService.employeeMultipleLoan(listToApprove).subscribe(voucherMasterId => {
      this._messageService.clear();
      if (voucherMasterId > 0) {
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Loan approved successfully', life: 3000 });

        //print voucher
        this.printVoucher(voucherMasterId);
        //
      }
      // Refreshing Posting Accounts
      this._financialReportResolverResolver.resolve().subscribe();
      this.getLoanList();
    });
  }

  sellectAll(event: any) {
    this.loanList.forEach(e => e.Selected = event.checked);
    this.isToShowApproveBtn = event.checked;
    this.selectedCount = this.loanList.filter(e => e.Selected == true).length;
  };

  statusChange(event: any) {
    this.isToShowApproveBtn = (this.loanList?.find(e => e.Selected == true)?.LoanAmount ?? 0) > 0;
    this.selectedCount = this.loanList.filter(e => e.Selected == true).length;
  }

  public printVoucher(vouchersMasterId: number): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._voucherService
      .printVoucher(vouchersMasterId, true).subscribe(reportResponse => {
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
}