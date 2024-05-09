import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { DailyPaymentReceiptService } from '../../services/daily-payment-receipt.service';
import { DailyPaymentReceipt } from '../../models/daily-payment-receipt.model';
import { TransactionReportRequest } from '../../../transaction-reports/transaction-report-model.model';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-daily-payment-receipt',
  templateUrl: './daily-payment-receipt.component.html',
  styleUrls: ['./daily-payment-receipt.component.scss']
})
export class DailyPaymentReceiptComponent implements OnInit {
  @Input() dailyPaymentRequest: TransactionReportRequest = new TransactionReportRequest();

  constructor(
    // private _breadCrumbService: AppBreadcrumbService,
    private _dailyPaymentReceiptService: DailyPaymentReceiptService,
    private _messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.setBreadCrumb();
  }

  public printReport() {
    let request = this.getRequestModel();
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });

    this._dailyPaymentReceiptService.printDailyPaymentReceiptReport(request).pipe(
      map((response: any) => {
        if (response) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });

          let blob: Blob = response.body as Blob;
          let frame = document.getElementById("dailyTransactionFrame") as HTMLIFrameElement;
          frame.src = window.URL.createObjectURL(blob);

        }
        else {
          this._messageService.clear();
          this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'No record found for selected criteria' });


        }
      })
    ).subscribe();
  }

  getRequestModel(): TransactionReportRequest {
    let response = new TransactionReportRequest();
    response.OrganizationId = this.dailyPaymentRequest.OrganizationId;
    response.OutletId = this.dailyPaymentRequest.OutletId;
    response.Address = this.dailyPaymentRequest.Address;
    response.OutletName = this.dailyPaymentRequest.OutletName;
    response.FromDate = DateHelperService.getServerDateFormat(this.dailyPaymentRequest.FromDate);
    response.ToDate = DateHelperService.getServerDateFormat(this.dailyPaymentRequest.ToDate);
    response.IsActive = this.dailyPaymentRequest.IsActive;
    return response;
  }

  public setBreadCrumb(): void {
    // this._breadCrumbService.setItems([
    //   {
    //     label: 'Reports',
    //     url: 'reports'
    //   },
    //   { label: 'Daily Payment Receipt' },
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

