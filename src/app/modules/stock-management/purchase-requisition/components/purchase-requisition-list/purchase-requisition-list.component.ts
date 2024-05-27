import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { InvoiceDetailRequest, InvoiceMasterRequest, InvoiceParameterRequest } from 'src/app/modules/inventory/invoice/models/invoice.model';
import { PaginationResponse } from 'src/app/shared/models/pagination.model';
import { Table } from 'primeng/table';
import { AddInvoiceComponent } from 'src/app/modules/inventory/invoice/components/add-invoice/add-invoice.component';
import { INVOICE_STATUS, InventoryDocumentType, PaymentMode, TransactionTypeInvoiceENUM } from 'src/app/shared/enums/invoices.enum';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { StockManagementRights } from 'src/app/shared/enums/rights.enum';
import { PurchaseRequisitionMasterRequest } from '../../models/purchase-requisition.model';
import { PurchaseRequisitionService } from '../../services/purchase-requisition.service';
import { AddPurchanseRequisitionComponent } from '../add-purchase-requisition/add-purchase-requisition.component';

@Component({
  selector: 'app-puchase-requisition-list',
  templateUrl: './purchase-requisition-list.component.html',
  styleUrls: ['./purchase-requisition-list.component.scss']
})
export class PurchaseRequisitionListComponent implements OnInit {
  purchaseMasterList: PurchaseRequisitionMasterRequest[] = [];
  purchaseRequisitionToastIdKey: string = "";
  purchaseRequisitionRequest: InvoiceParameterRequest = new InvoiceParameterRequest();
  fromDate: Date = new Date()

  first: number = 0;
  rows: number = 10;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
  ];

  paginationResponse: PaginationResponse = new PaginationResponse();

  public datePickerFormat = DateHelperService.datePickerFormat;
  StockManagementRights = StockManagementRights;
  constructor(
    private _messageService: MessageService,
    private _invoiceService: PurchaseRequisitionService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _authQuery: AuthQuery,
    private _breadcrumbService: AppBreadcrumbService,
    private _fileViewerService: FileViewerService
  ) { }

  ngOnInit() {
    this.purchaseRequisitionRequest.FromDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate())
    this.getPurchaseRequisitionList();
  }

  ngAfterViewInit() {
    this._breadcrumbService.setBreadcrumbs([
      { label: `Purchase Requisition` },
    ]);
  }

  getPurchaseRequisitionList() {
    let request: InvoiceParameterRequest = new InvoiceParameterRequest();
    request.FromDate = DateHelperService.getServerDateFormat(this.purchaseRequisitionRequest.FromDate);
    request.ToDate = DateHelperService.getServerDateFormat(this.purchaseRequisitionRequest.ToDate);
    request.OutletId = this._authQuery?.PROFILE?.OutletId;
    request.SearchQuery = this.purchaseRequisitionRequest.SearchQuery;
    this._invoiceService.getPurchaseRequisitionList(request).subscribe(
      (data: PaginationResponse) => {
        if (data) {
          this.paginationResponse = data;
          this.purchaseMasterList = data.Data;
        }
      }
    )
  }

  addEditPurchaseRequisition(purchaseRequisition?: PurchaseRequisitionMasterRequest) {
    let selectedPurchaseRequisition = new PurchaseRequisitionMasterRequest();
    if (purchaseRequisition) {
      selectedPurchaseRequisition = purchaseRequisition
    }
    let purchaseRequisitionData = {
      InvoiceMasterData: selectedPurchaseRequisition,
    }

    let dialogRef = this._dialogService.open(AddPurchanseRequisitionComponent, {
      header: `${purchaseRequisition?.PurchaseRequisitionMasterId ?? 0 > 0 ? 'Edit' : 'Add'} Purchase Requisition`,
      data: purchaseRequisitionData,
      maximizable: true,
      height: "95%"
    });

    dialogRef.onClose.subscribe((res: boolean) => {
      res ? this.getPurchaseRequisitionList() : false;
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // postPurchaseRequisition(purchaseRequisition: PurchaseRequisitionMasterRequest) {
  //   this.purchaseRequisitionToastIdKey = purchaseRequisition.PurchaseRequisitionMasterId.toString()
  //   setTimeout(() => {
  //     this._confirmationService.confirm({
  //       message: 'Are you sure you want to post Purchase Requisition?',
  //       icon: 'pi pi-exclamation-triangle',
  //       accept: () => {
  //         this._invoiceService.postPurchaseRequisitions([purchaseRequisition.PurchaseRequisitionMasterId]).subscribe(
  //           (x: boolean) => {
  //             if (x) {
  //               this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Purchase Requisition Posted Successfully', life: 3000 });
  //               this.getPurchaseRequisitionList();
  //             }
  //           }
  //         )
  //       },
  //       reject: () => {
  //       },
  //       key: purchaseRequisition.PurchaseRequisitionMasterId.toString()
  //     });
  //   }, 10);
  // }

  createPurhcaseInvoice(purchaseRequisition: PurchaseRequisitionMasterRequest) {
    let selectedInvoice = new InvoiceMasterRequest();
    selectedInvoice.BalanceAmount = purchaseRequisition.TotalAmount;
    selectedInvoice.DocumentTypeId = InventoryDocumentType.Purchase;
    selectedInvoice.InvoiceDate = purchaseRequisition.PurchaseRequisitionDate;
    selectedInvoice.Remarks = purchaseRequisition.Remarks;
    selectedInvoice.ReferenceNo = `${purchaseRequisition.PurchaseRequisitionMasterId}`;
    selectedInvoice.InvoiceStatus = INVOICE_STATUS.UnPosted;
    selectedInvoice.NetAmount = purchaseRequisition.TotalAmount;
    selectedInvoice.TotalAmount = purchaseRequisition.TotalAmount;
    selectedInvoice.ParticularId = purchaseRequisition.ParticularId;
    // selectedInvoice.OrderMasterId = purchaseRequisition.ProjectsId;
    selectedInvoice.OutletId = purchaseRequisition.OutletId;
    selectedInvoice.PaymentMode = PaymentMode.Cash;

    let invoiceData = {
      InvoiceMasterData: selectedInvoice,
      DocumentTypeId: InventoryDocumentType.Purchase,
      isFromPurchaseRequisition: true
    }
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait purchase invoice is being generated.', sticky: true });
    this._invoiceService.getPurchaseRequisitionDetailById(purchaseRequisition.PurchaseRequisitionMasterId)
      .subscribe(res => {
        this._messageService.clear();
        if (res?.length > 0) {
          res.forEach(detail => {
            let invoiceDetail = new InvoiceDetailRequest();
            CommonHelperService.mapSourceObjToDestination(detail, invoiceDetail);
            if (invoiceDetail.ItemId > 0) {
              invoiceDetail.TransactionType = TransactionTypeInvoiceENUM.StockIn;
              invoiceData.InvoiceMasterData.InvoiceDetailsRequest.push(invoiceDetail);
            }
          });

          let dialogRef = this._dialogService.open(AddInvoiceComponent, {
            header: `Add Purchase Invoice of Requisition # ${purchaseRequisition.PurchaseRequisitionMasterId}`,
            data: invoiceData,
            maximizable: true,
            height: "95%"
          });

          dialogRef.onClose.subscribe((res: boolean) => {
            // res ? this.getPurchaseRequisitionList() : false;
          });
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Purchase Invoice generated Successfully', life: 3000 });
        }
      });
  }

  deletePurchaseRequisition(purchaseRequisition: PurchaseRequisitionMasterRequest) {
    this.purchaseRequisitionToastIdKey = purchaseRequisition.PurchaseRequisitionMasterId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete purchase order?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._invoiceService.removePurchaseRequisition(purchaseRequisition.PurchaseRequisitionMasterId).subscribe(
            (x: boolean) => {
              if (x) {
                this.getPurchaseRequisitionList();
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Purchase Requisition Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: purchaseRequisition.PurchaseRequisitionMasterId.toString()
      });
    }, 10);
  }

  public printPurchaseRequisition(PurchaseRequisitionMasterId: number): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._invoiceService
      .PurchaseRequisitionReport(PurchaseRequisitionMasterId).subscribe(reportResponse => {
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
    this.purchaseRequisitionRequest.PageNumber = event.page + 1;
    this.purchaseRequisitionRequest.RecordsPerPage = event.rows;
    this.getPurchaseRequisitionList();
  }
}
