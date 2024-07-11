import { Component, Input, OnInit } from '@angular/core';
import { InvoiceListResponse, InvoiceMasterRequest, InvoiceParameterRequest } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AddInvoiceComponent } from '../add-invoice/add-invoice.component';
import { InventoryDocumentType, TransactionTypeInvoiceENUM } from 'src/app/shared/enums/invoices.enum';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { StockManagementRights } from 'src/app/shared/enums/rights.enum';
import { ItemsService } from '../../../pre-requisite/items/services/items.service';
import { ItemsQuery } from '../../../pre-requisite/items/states/items.query';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  @Input() InvoiceType: number = 0;
  invoiceName: string = "";
  invoiceMasterList: InvoiceMasterRequest[] = [];
  itemtypeToastIdKey: string = "";
  invoiceRequest: InvoiceParameterRequest = new InvoiceParameterRequest();
  invoiceListResponse: InvoiceListResponse = new InvoiceListResponse();
  InventoryDocumentType = InventoryDocumentType;
  fromDate: Date = new Date()

  first: number = 0;
  rows: number = 10;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
  ];

  public datePickerFormat = DateHelperService.datePickerFormat;

  StockManagementRights = StockManagementRights;
  constructor(
    private _messageService: MessageService,
    private _invoiceService: InvoiceService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _authQuery: AuthQuery,
    private _breadcrumbService: AppBreadcrumbService,
    private _fileViewerService: FileViewerService,
    private _itemsQuery: ItemsQuery,
    private _itemService: ItemsService,
  ) { }

  ngOnInit() {
    this.invoiceRequest.FromDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
    this.getInvoiceListPagination();
  }

  ngAfterViewInit() {
    this._breadcrumbService.setBreadcrumbs([
      { label: `${this.invoiceName} Invoice` },
    ]);
  }

  getInvoiceListPagination() {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait data is being generating', sticky: true });
    let request: InvoiceParameterRequest = new InvoiceParameterRequest();
    if (this.InvoiceType == InventoryDocumentType.Issuance) {
      request.DocumentTypeId = InventoryDocumentType.Issuance;
      this.invoiceName = "Issuance";
    }
    else if (this.InvoiceType == InventoryDocumentType.IssuanceReturn) {
      request.DocumentTypeId = InventoryDocumentType.IssuanceReturn;
      this.invoiceName = "Issuance Return";
    }
    else if (this.InvoiceType == InventoryDocumentType.Purchase) {
      request.DocumentTypeId = InventoryDocumentType.Purchase;
      this.invoiceName = "Purchase";
    }
    else if (this.InvoiceType == InventoryDocumentType.PurchaseReturn) {
      request.DocumentTypeId = InventoryDocumentType.PurchaseReturn;
      this.invoiceName = "Purchase Return";
    }
    else if (this.InvoiceType == InventoryDocumentType.Adjustment) {
      request.DocumentTypeId = InventoryDocumentType.Adjustment;
      this.invoiceName = "Adjustment";
    }
    request.FromDate = DateHelperService.getServerDateFormat(this.invoiceRequest.FromDate);
    request.ToDate = DateHelperService.getServerDateFormat(this.invoiceRequest.ToDate);
    request.OutletId = this._authQuery?.PROFILE?.OutletId;
    request.SearchQuery = this.invoiceRequest.SearchQuery;
    this._invoiceService.getInvoiceList(request).subscribe(
      (data: InvoiceListResponse) => {
        this._messageService.clear();
        if (data) {
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data successfully generated.', life: 3000 });
          // this.invoiceListResponse = data;
          this.invoiceMasterList = data.Data;
        }
      }
    )
  }

  addEditInvoice(invoice?: InvoiceMasterRequest) {
    let selectedInvoice = new InvoiceMasterRequest();
    if (invoice) {
      selectedInvoice = invoice
    }
    let invoiceData = {
      InvoiceMasterData: selectedInvoice,
      DocumentTypeId: this.InvoiceType,
    }

    let dialogRef = this._dialogService.open(AddInvoiceComponent, {
      header: `${invoice?.InvoiceMasterId ?? 0 > 0 ? `Edit ${this.invoiceName} Invoice ${invoice?.InvoiceSerialNo}` : `Add ${this.invoiceName} Invoice`} `,
      data: invoiceData,
      maximizable: true,
      height: "95%",
      width: "90%"
    });

    dialogRef.onClose.subscribe((res: boolean) => {
      res ? this.getInvoiceListPagination() : false;
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  postInvoice(invoice: InvoiceMasterRequest) {
    this.itemtypeToastIdKey = invoice.InvoiceMasterId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to post invoice?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._invoiceService.postInvoices(invoice).subscribe(
            (x: boolean) => {
              if (x) {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Invoice Posted Successfully', life: 3000 });
                this.getInvoiceListPagination();
              }
            }
          )
        },
        reject: () => {
        },
        key: invoice.InvoiceMasterId.toString()
      });
    }, 10);
  }

  createPurchaseReturn(invoice: InvoiceMasterRequest) {
    let selectedInvoice = new InvoiceMasterRequest();
    if (invoice) {

      selectedInvoice = invoice
    }
    let invoiceData = {
      InvoiceMasterData: selectedInvoice,
      DocumentTypeId: InventoryDocumentType.PurchaseReturn,
      ReturnInvoice: true
    }
    let dialogRef = this._dialogService.open(AddInvoiceComponent, {
      header: `Add Purchase Return Invoice`,
      data: invoiceData,
      maximizable: true,
    });
  }

  createIssuanceReturn(invoice: InvoiceMasterRequest) {
    let selectedInvoice = new InvoiceMasterRequest();
    if (invoice) {

      selectedInvoice = invoice
    }
    let invoiceData = {
      InvoiceMasterData: selectedInvoice,
      DocumentTypeId: InventoryDocumentType.IssuanceReturn,
      ReturnInvoice: true,
    }
    let dialogRef = this._dialogService.open(AddInvoiceComponent, {
      header: `Add Issuance Return Invoice`,
      data: invoiceData,
      maximizable: true
    });
  }

  deleteInvoice(invoice: InvoiceMasterRequest) {
    this.itemtypeToastIdKey = invoice.InvoiceMasterId.toString();
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete invoice?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._invoiceService.removeInvoice(invoice.InvoiceMasterId).subscribe(
            (x: boolean) => {
              if (x) {
                this.getInvoiceListPagination();
                this._itemsQuery.removeItemStore();
                this._itemService.getItemList(this._authQuery.OutletId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Invoice Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: invoice.InvoiceMasterId.toString()
      });
    }, 10);
  }

  public printInvoice(invoiceMasterId: number): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._invoiceService
      .invoiceReport(invoiceMasterId).subscribe(reportResponse => {
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

  onPageChange(event: any) {
    this.invoiceRequest.PageNumber = event.page + 1;
    this.invoiceRequest.RecordsPerPage = event.rows;
    this.getInvoiceListPagination();
  }
}
