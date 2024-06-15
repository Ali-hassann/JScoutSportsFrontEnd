import { Component, OnInit } from '@angular/core';
import { PurchaseOrderMasterRequest } from '../../models/purchase-order.model';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { InvoiceDetailRequest, InvoiceMasterRequest, InvoiceParameterRequest } from 'src/app/modules/inventory/invoice/models/invoice.model';
import { PaginationResponse } from 'src/app/shared/models/pagination.model';
import { AddPurchanseOrderComponent } from '../add-purchase-order/add-purchase-order.component';
import { Table } from 'primeng/table';
import { AddInvoiceComponent } from 'src/app/modules/inventory/invoice/components/add-invoice/add-invoice.component';
import { INVOICE_STATUS, InventoryDocumentType, PaymentMode, TransactionTypeInvoiceENUM } from 'src/app/shared/enums/invoices.enum';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { StockManagementRights } from 'src/app/shared/enums/rights.enum';

@Component({
  selector: 'app-puchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss']
})
export class PurchaseOrderListComponent implements OnInit {
  purchaseMasterList: PurchaseOrderMasterRequest[] = [];
  purchaseOrderToastIdKey: string = "";
  purchaseOrderRequest: InvoiceParameterRequest = new InvoiceParameterRequest();
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
    private _invoiceService: PurchaseOrderService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _authQuery: AuthQuery,
    private _breadcrumbService: AppBreadcrumbService,
    private _fileViewerService: FileViewerService
  ) { }

  ngOnInit() {
    this.purchaseOrderRequest.FromDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate())
    this.getPurchaseOrderList();
  }

  ngAfterViewInit() {
    this._breadcrumbService.setBreadcrumbs([
      { label: `Purchase Order` },
    ]);
  }

  getPurchaseOrderList() {
    let request: InvoiceParameterRequest = new InvoiceParameterRequest();
    request.FromDate = DateHelperService.getServerDateFormat(this.purchaseOrderRequest.FromDate);
    request.ToDate = DateHelperService.getServerDateFormat(this.purchaseOrderRequest.ToDate);
    request.OutletId = this._authQuery?.PROFILE?.OutletId;
    request.SearchQuery = this.purchaseOrderRequest.SearchQuery;
    this._invoiceService.getPurchaseOrderList(request).subscribe(
      (data: PaginationResponse) => {
        if (data) {
          this.paginationResponse = data;
          this.purchaseMasterList = data.Data;
        }
      }
    )
  }

  addEditPurchaseOrder(purchaseOrder: PurchaseOrderMasterRequest = new PurchaseOrderMasterRequest()) {
    let selectedPurchaseOrder = new PurchaseOrderMasterRequest();
    purchaseOrder?.PurchaseOrderMasterId > 0 ? selectedPurchaseOrder = purchaseOrder : ''

    let dialogRef = this._dialogService.open(AddPurchanseOrderComponent, {
      header: `${purchaseOrder?.PurchaseOrderMasterId ?? 0 > 0 ? 'Edit' : 'Add'} Purchase Order`,
      data: { purchaseOrderData: selectedPurchaseOrder, purchaseRequisitionIds: [] },
      maximizable: true,
      height: "95%"
    });

    dialogRef.onClose.subscribe((res: boolean) => {
      res ? this.getPurchaseOrderList() : false;
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // postPurchaseOrder(purchaseOrder: PurchaseOrderMasterRequest) {
  //   this.purchaseOrderToastIdKey = purchaseOrder.PurchaseOrderMasterId.toString()
  //   setTimeout(() => {
  //     this._confirmationService.confirm({
  //       message: 'Are you sure you want to post Purchase Order?',
  //       icon: 'pi pi-exclamation-triangle',
  //       accept: () => {
  //         this._invoiceService.postPurchaseOrders([purchaseOrder.PurchaseOrderMasterId]).subscribe(
  //           (x: boolean) => {
  //             if (x) {
  //               this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Purchase Order Posted Successfully', life: 3000 });
  //               this.getPurchaseOrderList();
  //             }
  //           }
  //         )
  //       },
  //       reject: () => {
  //       },
  //       key: purchaseOrder.PurchaseOrderMasterId.toString()
  //     });
  //   }, 10);
  // }

  createPurhcaseInvoice(purchaseOrder: PurchaseOrderMasterRequest) {
    let selectedInvoice = new InvoiceMasterRequest();
    selectedInvoice.BalanceAmount = purchaseOrder.TotalAmount;
    selectedInvoice.DocumentTypeId = InventoryDocumentType.Purchase;
    selectedInvoice.InvoiceDate = purchaseOrder.PurchaseOrderDate;
    selectedInvoice.Remarks = purchaseOrder.Remarks;
    selectedInvoice.ReferenceNo = `${purchaseOrder.PurchaseOrderMasterId}`;
    selectedInvoice.InvoiceStatus = INVOICE_STATUS.UnPosted;
    selectedInvoice.NetAmount = purchaseOrder.TotalAmount;
    selectedInvoice.TotalAmount = purchaseOrder.TotalAmount;
    selectedInvoice.ParticularId = purchaseOrder.ParticularId;
    selectedInvoice.OrderMasterId = purchaseOrder.OrderMasterId;
    selectedInvoice.OutletId = purchaseOrder.OutletId;
    selectedInvoice.PaymentMode = PaymentMode.Cash;

    let invoiceData = {
      InvoiceMasterData: selectedInvoice,
      DocumentTypeId: InventoryDocumentType.Purchase,
      isFromPurchaseOrder: true
    }
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait purchase invoice is being generated.', sticky: true });
    this._invoiceService.getPurchaseOrderDetailById(purchaseOrder.PurchaseOrderMasterId)
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
            header: `Add Purchase Invoice of Order # ${purchaseOrder.PurchaseOrderMasterId}`,
            data: invoiceData,
            maximizable: true,
            height: "95%"
          });

          dialogRef.onClose.subscribe((res: boolean) => {
            // res ? this.getPurchaseOrderList() : false;
          });
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Purchase Invoice generated Successfully', life: 3000 });
        }
      });
  }

  deletePurchaseOrder(purchaseOrder: PurchaseOrderMasterRequest) {
    this.purchaseOrderToastIdKey = purchaseOrder.PurchaseOrderMasterId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete purchase order?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._invoiceService.removePurchaseOrder(purchaseOrder.PurchaseOrderMasterId).subscribe(
            (x: boolean) => {
              if (x) {
                this.getPurchaseOrderList();
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Purchase Order Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: purchaseOrder.PurchaseOrderMasterId.toString()
      });
    }, 10);
  }

  public printPurchaseOrder(PurchaseOrderMasterId: number): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._invoiceService
      .PurchaseOrderReport(PurchaseOrderMasterId).subscribe(reportResponse => {
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
    this.purchaseOrderRequest.PageNumber = event.page + 1;
    this.purchaseOrderRequest.RecordsPerPage = event.rows;
    this.getPurchaseOrderList();
  }
}
