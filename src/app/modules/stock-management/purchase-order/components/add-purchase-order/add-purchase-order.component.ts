import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { PurchaseOrderDetailRequest, PurchaseOrderMasterRequest } from '../../models/purchase-order.model';
import { ItemRequest } from 'src/app/modules/inventory/pre-requisite/items/models/items.model';
import { ParticularRequest } from 'src/app/modules/inventory/item-particular/models/item-particular.model';
import { ItemsQuery } from 'src/app/modules/inventory/pre-requisite/items/states/items.query';
import { ParticularQuery } from 'src/app/modules/inventory/item-particular/states/item-paticular.query';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { AddItemVendorsComponent } from 'src/app/modules/inventory/item-particular/components/add-item-vendors/add-item-vendors.component';
import { AddItemsComponent } from 'src/app/modules/inventory/pre-requisite/items/components/add-items/add-items.component';
import { PurchaseRequisitionDetailRequest } from '../../../purchase-requisition/models/purchase-requisition.model';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.scss']
})
export class AddPurchanseOrderComponent implements OnInit {

  purchaseOrderMasterRequest: PurchaseOrderMasterRequest = new PurchaseOrderMasterRequest();
  addPurchaseOrderDetailObj: PurchaseOrderDetailRequest = new PurchaseOrderDetailRequest();
  itemsList: ItemRequest[] = [];
  particularList: ParticularRequest[] = [];
  selectedItem: ItemRequest = new ItemRequest();

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _purchaseOrderService: PurchaseOrderService,
    public _configDialog: DynamicDialogConfig,
    private _messageService: MessageService,
    private _itemsQuery: ItemsQuery,
    public _dialogService: DialogService,
    private _particularQuery: ParticularQuery,
    private _fileViewerService: FileViewerService
  ) {
    if (_configDialog?.data?.purchaseOrderData?.PurchaseOrderMasterId > 0) {
      this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait detail list is being generated.', sticky: true });
      CommonHelperService.mapSourceObjToDestination(_configDialog?.data?.purchaseOrderData, this.purchaseOrderMasterRequest);
      this.purchaseOrderMasterRequest.PurchaseOrderDate = DateHelperService.getDatePickerFormat(_configDialog?.data?.purchaseOrderData?.PurchaseOrderDate);
      this._purchaseOrderService.getPurchaseOrderDetailById(this.purchaseOrderMasterRequest.PurchaseOrderMasterId)
        .subscribe((invoiceDetail: PurchaseOrderDetailRequest[]) => {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Purchase requisition list generated Successfully', life: 3000 });
          this.purchaseOrderMasterRequest.PurchaseOrderDetailRequest = invoiceDetail;
        });
    } else if (_configDialog?.data?.purchaseRequisitionIds?.length > 0) {
      this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait detail list is being generated.', sticky: true });
      this._messageService.clear();
      this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Purchase requisition list generated Successfully', life: 3000 });
      this.purchaseOrderMasterRequest.ReferenceNo = `P.REQ #( ${_configDialog?.data?.purchaseRequisitionIds?.join(',') ?? ""} )`;

      this._purchaseOrderService.getRequisitionDetailByIds(_configDialog?.data?.purchaseRequisitionIds)
        .subscribe((purchaseRequisitionDetails: PurchaseRequisitionDetailRequest[]) => {
          this.purchaseOrderMasterRequest.PurchaseOrderDetailRequest = purchaseRequisitionDetails.map(r => {
            let detail = new PurchaseOrderDetailRequest();
            CommonHelperService.mapSourceObjToDestination(r, detail);
            detail.Price = this.itemsList.find(e => e.ItemId === r.ItemId)?.LastPrice ?? 0;
            detail.Amount = detail.Price * detail.Quantity;
            return detail;
          });
        });
    }
  }

  ngOnInit(): void {
    this.getItemList();
    this.getParticularList();
  }

  private getItemList() {
    this._itemsQuery.itemsList$.subscribe((items: ItemRequest[]) => {
      this.itemsList = items;
    });
  }

  private getParticularList() {
    this._particularQuery.VendorList$.subscribe((particulars: ParticularRequest[]) => {
      this.particularList = particulars;
    });
  }

  public Close(successfull?: boolean) {
    this._configDialogRef.close(successfull);
  }

  addVender() {
    let dialogRef = this._dialogService.open(AddItemVendorsComponent, {
      header: 'Add Vender',
      data: { particularType: "Vendor" },
      width: '60%'
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.getParticularList();
      }
    });
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

  public submit(f: NgForm, isToPrint: boolean) {
    if (!f.invalid && this.purchaseOrderMasterRequest.ParticularId) {
      let request: PurchaseOrderMasterRequest = new PurchaseOrderMasterRequest();
      CommonHelperService.mapSourceObjToDestination(this.purchaseOrderMasterRequest, request);
      request.PurchaseOrderDate = DateHelperService.getServerDateFormat(request.PurchaseOrderDate);
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      request.TotalAmount = CommonHelperService.getSumofArrayPropert(request.PurchaseOrderDetailRequest, "Amount");

      if (request.PurchaseOrderMasterId > 0) {
        this.updatePurchaseOrder(request, isToPrint);
      }
      else {
        this.addPurchaseOrder(request, isToPrint);
      }
    }
    else {
      this._messageService.add({ severity: 'warn', summary: 'Form Fields are invalid', detail: 'Validation failed' });
    }
  }

  private addPurchaseOrder(request: PurchaseOrderMasterRequest, isToPrint: boolean) {
    this._purchaseOrderService.addPurchaseOrder(request).subscribe(
      (x: PurchaseOrderMasterRequest) => {
        if (x.PurchaseOrderMasterId > 0) {
          this._messageService.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          isToPrint ? this.printPurchaseOrder(x.PurchaseOrderMasterId) : false;
          this.Close(true);
        }
      }
    );
  }

  private updatePurchaseOrder(request: PurchaseOrderMasterRequest, isToPrint: boolean) {
    this._purchaseOrderService.updatePurchaseOrder(request).subscribe(
      (x: PurchaseOrderMasterRequest) => {
        if (x.PurchaseOrderMasterId > 0) {
          this._messageService.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          isToPrint ? this.printPurchaseOrder(x.PurchaseOrderMasterId) : false;
          this.Close(true);
        }
      }
    );
  }

  public printPurchaseOrder(purchaseOrderMasterId: number) {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._purchaseOrderService
      .PurchaseOrderReport(purchaseOrderMasterId).subscribe(reportResponse => {
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

  public addPurchaseOrderDetail() {
    if (this.addPurchaseOrderDetailObj.Quantity > 0) {
      //in if condition we check if item already exist in detail and get specific detail and update it
      const matchingDetail = this.purchaseOrderMasterRequest?.PurchaseOrderDetailRequest
        .find((detail: PurchaseOrderDetailRequest) =>
          detail.ItemId === this.addPurchaseOrderDetailObj.ItemId);

      if (matchingDetail) {
        this._messageService.add({ severity: 'warn', summary: 'Item Exist', detail: 'Selected Item is already in list we are increasing its quantity' });
        let updatedDetail: PurchaseOrderDetailRequest = matchingDetail;
        updatedDetail.Quantity += this.addPurchaseOrderDetailObj.Quantity
        updatedDetail.Amount = updatedDetail.Quantity * updatedDetail.Price;
        const index = this.purchaseOrderMasterRequest.PurchaseOrderDetailRequest.indexOf(matchingDetail);
        this.purchaseOrderMasterRequest.PurchaseOrderDetailRequest[index] = updatedDetail;
      }
      else {
        this.addPurchaseOrderDetailObj.Amount = this.addPurchaseOrderDetailObj.Quantity * this.addPurchaseOrderDetailObj.Price;
        if (this.purchaseOrderMasterRequest?.PurchaseOrderMasterId > 0) {
          this.addPurchaseOrderDetailObj.PurchaseOrderMasterId = this.purchaseOrderMasterRequest.PurchaseOrderMasterId;
        }

        this.purchaseOrderMasterRequest.PurchaseOrderDetailRequest.unshift(this.addPurchaseOrderDetailObj);
        this.addPurchaseOrderDetailObj = new PurchaseOrderDetailRequest();
        this.selectedItem = new ItemRequest();
      }
      this.invoiceMasterSummaryUpdate();
    } else {
      this._messageService.add({ severity: 'error', summary: 'Quantity', detail: 'Please select item and quatity must be greaten than zero' });
    }

  }

  invoiceMasterSummaryUpdate() {
    this.purchaseOrderMasterRequest.TotalAmount = CommonHelperService.getSumofArrayPropert(this.purchaseOrderMasterRequest.PurchaseOrderDetailRequest, 'Amount');
    // this.purchaseOrderMasterRequest.NetAmount = this.purchaseOrderMasterRequest.TotalAmount - this.purchaseOrderMasterRequest.Discount;
    // this.purchaseOrderMasterRequest.BalanceAmount = this.purchaseOrderMasterRequest.NetAmount - this.purchaseOrderMasterRequest.PaidReceivedAmount;
  }

  deletePurchanseOrderDetail(index: number) {
    this.purchaseOrderMasterRequest.PurchaseOrderDetailRequest.splice(index, 1);
    this.invoiceMasterSummaryUpdate();
  }

  onDetailChange(detail: PurchaseOrderDetailRequest) {
    detail.Amount = detail.Quantity * detail.Price;
    this.invoiceMasterSummaryUpdate();
  }

  onItemChange() {
    this.addPurchaseOrderDetailObj.ItemId = this.selectedItem.ItemId;
    this.addPurchaseOrderDetailObj.ItemName = this.selectedItem.ItemName;
    this.addPurchaseOrderDetailObj.UnitName = this.selectedItem.UnitName;
    this.addPurchaseOrderDetailObj.Price = this.selectedItem.LastPrice;
  }
}
