import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { VOUCHER_TYPE } from 'src/app/shared/enums/voucher.enum';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DailyTransactionReportService } from '../../services/daily-transaction-report.service';
import { TransactionReportRequest } from '../../../transaction-reports/transaction-report-model.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-daily-transaction-report',
  templateUrl: './daily-transaction-report.component.html',
  styleUrls: ['./daily-transaction-report.component.scss']
})
export class DailyTransactionReportComponent implements OnInit {
  @Input() dailyTransactionRequest: TransactionReportRequest = new TransactionReportRequest();

  public voucherTypeList = [
    { name: 'All', value: VOUCHER_TYPE.None },
    { name: 'Cash Payment', value: VOUCHER_TYPE.CashPayment },
    { name: 'Bank Payment', value: VOUCHER_TYPE.BankPayment },
    { name: 'Cash Receipt', value: VOUCHER_TYPE.CashReceipt },
    { name: 'Bank Receipt', value: VOUCHER_TYPE.BankReceipt },
    { name: 'Journal', value: VOUCHER_TYPE.Journal }
  ];

  constructor(
    // private _breadCrumbService: AppBreadcrumbService,
    private _dailyTransactionService: DailyTransactionReportService,
    private _messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.setBreadCrumb();
  }

  public printReport() {
    let request = this.getRequestModel();
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating' });
    this._dailyTransactionService.printDailyTransactionReport(request).pipe(
      map((response: any) => {
        if (response) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });
          let blob: Blob = response.body as Blob;
          let frame = document.getElementById("frame") as HTMLIFrameElement;
          frame.src = window.URL.createObjectURL(blob);
        }
        else {
          this._messageService.clear();
          this._messageService.add({ severity: 'info', summary: 'Info', detail: "No record found for selected criteria" });
        }
      })
    ).subscribe();
  }

  getRequestModel(): TransactionReportRequest {
    let response = new TransactionReportRequest();
    response.OrganizationId = this.dailyTransactionRequest.OrganizationId;
    response.OutletId = this.dailyTransactionRequest.OutletId;
    response.Address = this.dailyTransactionRequest.Address;
    response.OutletName = this.dailyTransactionRequest.OutletName;
    response.FromDate = DateHelperService.getServerDateFormat(this.dailyTransactionRequest.FromDate);
    response.ToDate = DateHelperService.getServerDateFormat(this.dailyTransactionRequest.ToDate);
    response.IsActive = this.dailyTransactionRequest.IsActive;
    response.VoucherTypeId = this.dailyTransactionRequest.VoucherTypeId;
    return response;
  }

  public setBreadCrumb(): void {
    // this._breadCrumbService.setItems([
    //   {
    //     label: 'Reports',
    //     url: 'reports'
    //   },
    //   { label: 'Daily Transaction' },
    // ]);
  }

  public CheckDate(control: AbstractControl | any): void {
    const FromDate = control.get("FromDate").value;
    const ToDate = control.get("ToDate").value;
    if (FromDate > ToDate) {
      control.get("ToDate").setErrors({ ToDate: true });
    }
    else {
      control.get("ToDate").setErrors(null);
    }
  }
}

