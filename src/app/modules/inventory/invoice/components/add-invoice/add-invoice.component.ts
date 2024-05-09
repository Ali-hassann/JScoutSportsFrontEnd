import { Component, OnInit } from '@angular/core';
import { InvoiceDetailRequest, InvoiceMasterRequest } from '../../models/invoice.model';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { InvoiceService } from '../../services/invoice.service';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ItemsQuery } from '../../../pre-requisite/items/states/items.query';
import { ItemRequest } from '../../../pre-requisite/items/models/items.model';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { ParticularQuery } from '../../../item-particular/states/item-paticular.query';
import { ParticularRequest } from '../../../item-particular/models/item-particular.model';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { InventoryDocumentType, PaymentMode, TransactionTypeInvoiceENUM } from 'src/app/shared/enums/invoices.enum';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { OrderMasterRequest } from 'src/app/modules/production/order/models/order.model';
import { OrderQuery } from 'src/app/modules/production/order/states/order.query';
import { StockManagementRights } from 'src/app/shared/enums/rights.enum';
import { duration } from 'moment-timezone';
import { AddItemsComponent } from '../../../pre-requisite/items/components/add-items/add-items.component';
import { AddItemVendorsComponent } from '../../../item-particular/components/add-item-vendors/add-item-vendors.component';
import { ItemsService } from '../../../pre-requisite/items/services/items.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {

  invoiceMasterRequest: InvoiceMasterRequest = new InvoiceMasterRequest();
  addInvoiceDetailObj: InvoiceDetailRequest = new InvoiceDetailRequest();
  itemsList: ItemRequest[] = [];
  particularList: ParticularRequest[] = [];
  selectedItem: ItemRequest = new ItemRequest();
  documentTypeId: number = 0;
  inventoryDocumentType = InventoryDocumentType;
  isReturnFromList: boolean = false;

  TransactionTypeInvoiceENUM = TransactionTypeInvoiceENUM;

  paymentMode = [
    { value: 1, name: "Cash" },
    { value: 2, name: "Credit" },
    // { value: 3, name: "Cash & Credit" },
    // { value: 4, name: "Others" },
  ]

  transactionTypeList = [
    { value: 1, name: "Increase" },
    { value: 2, name: "Decrease" },
  ]

  orderList: OrderMasterRequest[] = [];
  StockManagementRights = StockManagementRights;
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _invoiceService: InvoiceService,
    public _configDialog: DynamicDialogConfig,
    private _messageService: MessageService,
    private _itemsQuery: ItemsQuery,
    private _itemService: ItemsService,
    private _particularQuery: ParticularQuery,
    public _dialogService: DialogService,
    private _orderQuery: OrderQuery,
    private _fileViewerService: FileViewerService
  ) {
    this.documentTypeId = _configDialog?.data?.DocumentTypeId;
    this.isReturnFromList = _configDialog?.data?.ReturnInvoice ?? false;
    if (_configDialog?.data?.InvoiceMasterData?.InvoiceMasterId > 0) {
      CommonHelperService.mapSourceObjToDestination(_configDialog?.data?.InvoiceMasterData, this.invoiceMasterRequest);
      this.invoiceMasterRequest.InvoiceDate = DateHelperService.getDatePickerFormat(this.invoiceMasterRequest.InvoiceDate);
      this._invoiceService.getInvoiceDetailListByInvoiceMasterId(this.invoiceMasterRequest.InvoiceMasterId)
        .subscribe((invoiceDetailList: InvoiceDetailRequest[]) => {
          this.invoiceMasterRequest.InvoiceDetailsRequest = invoiceDetailList;
        });
    }
    // from Purchanse Order
    if (_configDialog?.data?.InvoiceMasterData?.InvoiceMasterId == 0 && _configDialog?.data?.isFromPurchaseOrder) {
      CommonHelperService.mapSourceObjToDestination(_configDialog?.data?.InvoiceMasterData, this.invoiceMasterRequest);
      this.invoiceMasterRequest.InvoiceDate = DateHelperService.getDatePickerFormat(this.invoiceMasterRequest.InvoiceDate);
      this.invoiceMasterRequest.InvoiceDetailsRequest = _configDialog?.data?.InvoiceMasterData?.InvoiceDetailsRequest;
    }
  }

  ngOnInit(): void {
    this.getItemList();

    this._orderQuery.orderList$.subscribe((orders: OrderMasterRequest[]) => {
      this.orderList = orders;
    });

    this.getParticularList();

    if (this.documentTypeId == InventoryDocumentType.Adjustment) {
      //if type is adjustment then select payment mode others its values is 4
      this.invoiceMasterRequest.PaymentMode = PaymentMode.Others;
    }
  }

  private getItemList() {
    this._itemsQuery.itemsList$.subscribe((items: ItemRequest[]) => {
      this.itemsList = items;
    });
  }

  private getParticularList() {
    if (this.documentTypeId == InventoryDocumentType.Issuance || this.documentTypeId == InventoryDocumentType.IssuanceReturn || this.documentTypeId == InventoryDocumentType.Adjustment) {
      this._particularQuery.OthersList$.subscribe((particulars: ParticularRequest[]) => {
        this.particularList = particulars;
      });
    }
    else if (this.documentTypeId == InventoryDocumentType.Purchase || this.documentTypeId == InventoryDocumentType.PurchaseReturn) {
      this._particularQuery.VendorList$.subscribe((particulars: ParticularRequest[]) => {
        this.particularList = particulars;
      });
    }
  }

  public Close(successfull?: boolean) {
    this._configDialogRef.close(successfull);
  }

  addItem() {
    let dialogRef = this._dialogService.open(AddItemsComponent, {
      header: 'Add Item',
      data: null,
      width: '60%'
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.getItemList();
      }
    });
  }

  addParticular() {
    let particularType = (this.documentTypeId === InventoryDocumentType.Issuance || this.documentTypeId === InventoryDocumentType.IssuanceReturn) ? "Others" : (this.documentTypeId === InventoryDocumentType.Purchase || this.documentTypeId === InventoryDocumentType.PurchaseReturn) ? "Vendor" : ""
    let dialogRef = this._dialogService.open(AddItemVendorsComponent, {
      header: `Add ${particularType}`,
      data: { particularType: particularType },
      width: '60%'
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.getParticularList();
      }
    });
  }

  public submit(f: NgForm, isToPrint: boolean) {
    if (!f.invalid && this.invoiceMasterRequest.ParticularId) {
      let request: InvoiceMasterRequest = new InvoiceMasterRequest();
      this.invoiceMasterRequest.DocumentTypeId = this._configDialog?.data?.DocumentTypeId;
      CommonHelperService.mapSourceObjToDestination(this.invoiceMasterRequest, request);
      request.InvoiceDate = DateHelperService.getServerDateFormat(request.InvoiceDate);
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      request.InvoiceStatus = 0;
      if (this.isReturnFromList) {
        request.InvoiceMasterId = 0;
        request.InvoiceDetailsRequest.forEach((detail: InvoiceDetailRequest) => {
          detail.InvoiceDetailId = 0;
          detail.InvoiceMasterId = 0;
          if (request.DocumentTypeId == InventoryDocumentType.PurchaseReturn) {
            detail.TransactionType = TransactionTypeInvoiceENUM.StockOut;
          } else if (request.DocumentTypeId == InventoryDocumentType.IssuanceReturn) {
            detail.TransactionType = TransactionTypeInvoiceENUM.StockIn;
          }
        })
      }

      if (request.InvoiceMasterId > 0) {
        this.UpdateInvoice(request, isToPrint);
      }
      else {
        this.addInvoice(request, isToPrint);
      }
    }
    else {
      this._messageService.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addInvoice(request: InvoiceMasterRequest, isToPrint: boolean) {
    this._invoiceService.addInvoice(request).subscribe(
      (x: InvoiceMasterRequest) => {
        this._itemsQuery.removeItemStore();
        this._itemService.getItemList(this._authQuery.OutletId);
        if (x.InvoiceMasterId > 0) {
          this._messageService.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          isToPrint ? this.printInvoice(x.InvoiceMasterId) : false;
          this.Close(true);
        }
      }
    );
  }

  private UpdateInvoice(request: InvoiceMasterRequest, isToPrint: boolean) {
    this._invoiceService.updateInvoice(request).subscribe(
      (x: InvoiceMasterRequest) => {
        this._itemsQuery.removeItemStore();
        this._itemService.getItemList(this._authQuery.OutletId);
        if (x.InvoiceMasterId > 0) {
          this._messageService.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          isToPrint ? this.printInvoice(x.InvoiceMasterId) : false;
          this.Close(true);
        }
      }
    );
  }

  private printInvoice(invoiceMasterId: number) {
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

  public addInvoiceDetail() {
    if (this.addInvoiceDetailObj.Quantity > 0) {
      // check stock balance of item
      let selectedItem = this.itemsList.find(d => d.ItemId == this.addInvoiceDetailObj.ItemId);
      if ((selectedItem?.BalanceQuantity ?? 0) < this.addInvoiceDetailObj.Quantity
        && (this.documentTypeId == InventoryDocumentType.Issuance || this.documentTypeId == InventoryDocumentType.PurchaseReturn)) {
        this._messageService.add({
          severity: 'warn',
          summary: 'Stock Not Exist',
          detail: `${selectedItem?.ItemName} has stock ${selectedItem?.BalanceQuantity} but you select ${this.addInvoiceDetailObj.Quantity}`,
          life: 5000
        });
        return;
      }
      //
      //in if condition we check if item already exist in detail and get specific detail and update it
      const matchingDetail = this.invoiceMasterRequest?.InvoiceDetailsRequest
        .find((detail: InvoiceDetailRequest) =>
          detail.ItemId === this.addInvoiceDetailObj.ItemId);

      if (matchingDetail) {
        this._messageService.add({ severity: 'warn', summary: 'Item Exist', detail: 'Selected Item is already in list we are increasing its quantity' });
        let updatedDetail: InvoiceDetailRequest = matchingDetail;
        updatedDetail.Quantity += this.addInvoiceDetailObj.Quantity
        updatedDetail.Amount = updatedDetail.Quantity * updatedDetail.Price;
        const index = this.invoiceMasterRequest.InvoiceDetailsRequest.indexOf(matchingDetail);
        this.invoiceMasterRequest.InvoiceDetailsRequest[index] = updatedDetail;
      }
      else {
        if (this.documentTypeId == InventoryDocumentType.Issuance) {
          this.addInvoiceDetailObj.Price = selectedItem?.LastPrice ?? 0;
        }

        this.addInvoiceDetailObj.Amount = this.addInvoiceDetailObj.Quantity * this.addInvoiceDetailObj.Price;
        if (this.invoiceMasterRequest?.InvoiceMasterId > 0) {
          this.addInvoiceDetailObj.InvoiceMasterId = this.invoiceMasterRequest.InvoiceMasterId;
        }

        // assign stock type according to invoice and add in detail
        switch (this.documentTypeId) {
          case InventoryDocumentType.Purchase:
            this.addInvoiceDetailObj.TransactionType = TransactionTypeInvoiceENUM.StockIn;
            break;
          case InventoryDocumentType.PurchaseReturn:
            this.addInvoiceDetailObj.TransactionType = TransactionTypeInvoiceENUM.StockOut;

            break;
          case InventoryDocumentType.Issuance:
            this.addInvoiceDetailObj.TransactionType = TransactionTypeInvoiceENUM.StockOut;
            break;
          case InventoryDocumentType.IssuanceReturn:
            this.addInvoiceDetailObj.TransactionType = TransactionTypeInvoiceENUM.StockIn;
            break;
        }

        this.invoiceMasterRequest.InvoiceDetailsRequest.unshift(this.addInvoiceDetailObj);
        this.addInvoiceDetailObj = new InvoiceDetailRequest();
        this.selectedItem = new ItemRequest();
      }


      this.invoiceMasterSummaryUpdate();
    } else {
      this._messageService.add({ severity: 'error', summary: 'Quantity', detail: 'Please select item and quatity must be greaten than zero' });
    }

  }

  invoiceMasterSummaryUpdate() {
    this.invoiceMasterRequest.TotalAmount = CommonHelperService.getSumofArrayPropert(this.invoiceMasterRequest.InvoiceDetailsRequest, 'Amount');
    this.invoiceMasterRequest.NetAmount = this.invoiceMasterRequest.TotalAmount - this.invoiceMasterRequest.Discount;
    this.invoiceMasterRequest.BalanceAmount = this.invoiceMasterRequest.NetAmount - this.invoiceMasterRequest.PaidReceivedAmount;
  }

  deleteinvoiceDetail(index: number) {
    this.invoiceMasterRequest.InvoiceDetailsRequest.splice(index, 1);
    this.invoiceMasterSummaryUpdate();
  }

  onDetailChange(detail: InvoiceDetailRequest) {
    detail.Amount = detail.Quantity * detail.Price;
    this.invoiceMasterSummaryUpdate();
  }
  onItemChange() {
    this.addInvoiceDetailObj.ItemId = this.selectedItem.ItemId;
    this.addInvoiceDetailObj.ItemName = this.selectedItem.ItemName;
    this.addInvoiceDetailObj.UnitName = this.selectedItem.UnitName;
    this.addInvoiceDetailObj.Price = this.selectedItem.LastPrice;
  }
}
