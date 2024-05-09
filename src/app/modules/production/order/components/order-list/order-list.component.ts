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
import { OrderMasterRequest } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { AddOrderComponent } from '../add-order/add-order.component';
import { OrderQuery } from '../../states/order.query';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  MasterList: OrderMasterRequest[] = [];
  OrderToastIdKey: string = "";
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
  constructor(
    private _messageService: MessageService,
    private _orderService: OrderService,
    private _orderQuery: OrderQuery,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _authQuery: AuthQuery,
    private _breadcrumbService: AppBreadcrumbService,
    private _fileViewerService: FileViewerService
  ) { }

  ngOnInit() {
    this.getOrderList();
  }

  ngAfterViewInit() {
    this._breadcrumbService.setBreadcrumbs([
      { label: `Order` },
    ]);
  }

  getOrderList() {
    this._orderQuery.orderList$.subscribe(
      (data: OrderMasterRequest[]) => {
        if (data) {
          this.MasterList = data;
        }
      }
    )
  }

  addEditOrder(Order?: OrderMasterRequest) {
    let selectedOrder = new OrderMasterRequest();
    if (Order) {
      selectedOrder = Order
    }
    let OrderData = {
      InvoiceMasterData: selectedOrder,
    }

    let dialogRef = this._dialogService.open(AddOrderComponent, {
      header: `${Order?.OrderMasterId ?? 0 > 0 ? 'Edit' : 'Add'}  Order`,
      data: OrderData,
      maximizable: true,
      height: "95%"
    });

    dialogRef.onClose.subscribe((res: boolean) => {
      res ? this.getOrderList() : false;
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  postOrder(Order: OrderMasterRequest) {
    this.OrderToastIdKey = Order.OrderMasterId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to post  Order?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._orderService.postOrders([Order.OrderMasterId]).subscribe(
            (x: boolean) => {
              if (x) {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: ' Order Posted Successfully', life: 3000 });
                this.getOrderList();
              }
            }
          )
        },
        reject: () => {
        },
        key: Order.OrderMasterId.toString()
      });
    }, 10);
  }

  createPurhcaseInvoice(Order: OrderMasterRequest) {
    let selectedInvoice = new InvoiceMasterRequest();
    selectedInvoice.BalanceAmount = Order.TotalAmount;
    selectedInvoice.InvoiceDate = Order.OrderDate;
    selectedInvoice.Remarks = Order.Remarks;
    selectedInvoice.ReferenceNo = `${Order.OrderMasterId}`;
    selectedInvoice.InvoiceStatus = INVOICE_STATUS.UnPosted;
    selectedInvoice.NetAmount = Order.TotalAmount;
    selectedInvoice.TotalAmount = Order.TotalAmount;
    selectedInvoice.ParticularId = Order.ParticularId;
    selectedInvoice.OrderMasterId = Order.OrderMasterId;
    selectedInvoice.OutletId = Order.OutletId;
    selectedInvoice.PaymentMode = PaymentMode.Cash;

    let invoiceData = {
      InvoiceMasterData: selectedInvoice,
      isFromOrder: true
    }
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait  invoice is being generated.', sticky: true });
    this._orderService.getOrderDetailById(Order.OrderMasterId)
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
            header: `Add  Invoice of Order # ${Order.OrderMasterId}`,
            data: invoiceData,
            maximizable: true,
            height: "95%"
          });

          dialogRef.onClose.subscribe((res: boolean) => {
            // res ? this.getOrderList() : false;
          });
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: ' Invoice generated Successfully', life: 3000 });
        }
      });
  }

  deleteOrder(Order: OrderMasterRequest) {
    this.OrderToastIdKey = Order.OrderMasterId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete  order?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._orderService.removeOrder(Order.OrderMasterId).subscribe(
            (x: boolean) => {
              if (x) {
                this.getOrderList();
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: ' Order Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: Order.OrderMasterId.toString()
      });
    }, 10);
  }

  public printOrder(OrderMasterId: number): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._orderService
      .OrderReport(OrderMasterId).subscribe(reportResponse => {
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
