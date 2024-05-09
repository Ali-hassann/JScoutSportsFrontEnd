import { Component, OnInit } from '@angular/core';
import { InvoiceMasterRequest } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';

@Component({
  selector: 'app-add-production-invoice',
  templateUrl: './add-production-invoice.component.html',
  styleUrls: ['./add-production-invoice.component.scss']
})

export class AddProductionInvoiceComponent implements OnInit {
  public issuanceNo: number = 0;
  public itemtypeToastIdKey: string = "";
  invoiceMasterRequest: InvoiceMasterRequest = new InvoiceMasterRequest();
  constructor(
    private _messageService: MessageService,
    private _invoiceService: InvoiceService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _authQuery: AuthQuery,
    private _breadcrumbService: AppBreadcrumbService,
    private _fileViewerService: FileViewerService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._breadcrumbService.setBreadcrumbs([
      { label: `Production Issuance Invoice` },
    ]);
  }
}