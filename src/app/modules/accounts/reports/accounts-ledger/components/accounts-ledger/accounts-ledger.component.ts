import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { AccountsLedgerService } from '../../services/accounts-ledger.service';
import { FinancialReportRequest } from '../../../financial-reports/models/financial-report-model.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-accounts-ledger',
  templateUrl: './accounts-ledger.component.html',
  styleUrls: ['./accounts-ledger.component.scss']
})
export class AccountsLedgerComponent implements OnInit {
  @Input() ledgerRequest = new FinancialReportRequest();
  constructor(
    private _accountLedgerService: AccountsLedgerService,
    private _messageService: MessageService,
    // private _breadCrumbService: AppBreadcrumbService,
  ) {
  }

  ngOnInit(): void {
    this.setBreadCrumb();
  }
  public setBreadCrumb(): void {
    // this._breadCrumbService.setItems([
    //   { label: 'Reports' },
    //   { label: 'Accounts Ledger' },
    // ]);
  }

  public printLedger() {
    let request = this.getRequestModel();
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._accountLedgerService.printAccountLedgerVoucher(request).pipe(
      map((response: any) => {
        if (response?.body?.size > 0) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });
          let blob: Blob = response.body as Blob;
          let frame = document.getElementById("ledgerframe") as HTMLIFrameElement;
          frame.src = window.URL.createObjectURL(blob);
        }
        else {
          this._messageService.clear();
          this._messageService.add({
            severity: 'error',
            summary: 'Info',
            detail: 'No record found for selected criteria',
            life: 3000
          });
        }
      })
    ).subscribe();
  }

  getRequestModel(): FinancialReportRequest {
    let response = new FinancialReportRequest();
    response.OrganizationId = this.ledgerRequest.OrganizationId;
    response.OutletId = this.ledgerRequest.OutletId;
    response.Address = this.ledgerRequest.Address;
    response.OutletName = this.ledgerRequest.OutletName;
    response.FromDate = DateHelperService.getServerDateFormat(this.ledgerRequest.FromDate);
    response.ToDate = DateHelperService.getServerDateFormat(this.ledgerRequest.ToDate);
    response.IncludeZeroValue = this.ledgerRequest.IncludeZeroValue;
    response.IsActive = this.ledgerRequest.IsActive;
    response.PostingAccountsId = this.ledgerRequest.PostingAccountsId;
    return response;
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
  public ngOnDestroy(): void {
  }
}
