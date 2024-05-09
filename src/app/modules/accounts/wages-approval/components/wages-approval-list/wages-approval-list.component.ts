import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthQuery } from '../../../../common/auth/states/auth.query';
import { VoucherService } from '../../../voucher/services/voucher.service';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { WagesService } from 'src/app/modules/payroll/salary-sheet copy/services/wages.service';
import { PayrollReportRequest } from 'src/app/modules/payroll/reports/models/payroll-reports.model';
import { WagesRequest } from 'src/app/modules/payroll/salary-sheet copy/models/wages.model';

@Component({
  selector: 'app-wages-approval-list',
  templateUrl: './wages-approval-list.component.html',
  styleUrls: ['./wages-approval-list.component.scss']
})
export class WagesApprovalListComponent implements OnInit {

  wagesList: WagesRequest[] = [];
  selectedWagesRequest: WagesRequest = new WagesRequest();

  // visible: boolean = false;
  constructor(
    private _messageService: MessageService,
    private _voucherService: VoucherService,
    private _fileViewerService: FileViewerService,
    private _wagesService: WagesService,
    public _dialogService: DialogService,
    private _authService: AuthQuery,
    private confirmationService: ConfirmationService,
    // private _financialReportResolverResolver: FinancialReportResolverResolver
  ) { }

  ngOnInit() {
    this.getWagesList();
  }

  private getWagesList() {
    let request = new PayrollReportRequest();
    this._wagesService.getWagesApprovalList(request).subscribe(
      (data: WagesRequest[]) => {
        if (data) {
          this.wagesList = data;
        }
      }
    );
  }

  approveWages(wages: WagesRequest) {
    this.selectedWagesRequest = wages;

    this.confirmationService.confirm({
      message: 'Are you sure you want to Approve Wages?',
      accept: () => {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Wages are being apprved', life: 3000 });
        this.postWages();
      }
    });
  }

  postWages(isToCreateVoucher: boolean = false) {
    // this.visible = false;
    this.selectedWagesRequest.IsPosted = true;
    // this.selectedWagesRequest.IsToCreateVoucher = isToCreateVoucher;
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait wages are being approved', sticky: true });
    this._wagesService.postWages(this.selectedWagesRequest).subscribe(res => {
      this._messageService.clear();
       if (res > 0) {
      this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Wages approved successfully', life: 3000 });

      //print voucher
      this.printVoucher(res);
      
      }
      // Refreshing Posting Accounts
      // this._financialReportResolverResolver.resolve().subscribe();
      this.getWagesList();
    });
  }

  public printVoucher(vouchersMasterId: number): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._voucherService
      .printVoucher(vouchersMasterId).subscribe(reportResponse => {
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