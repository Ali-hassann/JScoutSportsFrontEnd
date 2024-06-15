import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { ItemRequest } from 'src/app/modules/inventory/pre-requisite/items/models/items.model';
import { ParticularRequest } from 'src/app/modules/inventory/item-particular/models/item-particular.model';
import { ItemsQuery } from 'src/app/modules/inventory/pre-requisite/items/states/items.query';
import { ParticularQuery } from 'src/app/modules/inventory/item-particular/states/item-paticular.query';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { AddItemVendorsComponent } from 'src/app/modules/inventory/item-particular/components/add-item-vendors/add-item-vendors.component';
import { AddItemsComponent } from 'src/app/modules/inventory/pre-requisite/items/components/add-items/add-items.component';
import { PurchaseRequisitionDetailRequest, PurchaseRequisitionMasterRequest } from '../../models/purchase-requisition.model';
import { PurchaseRequisitionService } from '../../services/purchase-requisition.service';

@Component({
  selector: 'app-add-purchase-requisition',
  templateUrl: './add-purchase-requisition.component.html',
  styleUrls: ['./add-purchase-requisition.component.scss']
})
export class AddPurchanseRequisitionComponent implements OnInit {

  purchaseRequisitionMasterRequest: PurchaseRequisitionMasterRequest = new PurchaseRequisitionMasterRequest();
  addPurchaseRequisitionDetailObj: PurchaseRequisitionDetailRequest = new PurchaseRequisitionDetailRequest();
  itemsList: ItemRequest[] = [];
  particularList: ParticularRequest[] = [];
  selectedItem: ItemRequest = new ItemRequest();

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _purchaseRequisitionService: PurchaseRequisitionService,
    public _configDialog: DynamicDialogConfig,
    private _messageService: MessageService,
    private _itemsQuery: ItemsQuery,
    public _dialogService: DialogService,
    private _particularQuery: ParticularQuery,
    private _fileViewerService: FileViewerService
  ) {
    if (_configDialog?.data?.InvoiceMasterData?.PurchaseRequisitionMasterId > 0) {
      CommonHelperService.mapSourceObjToDestination(_configDialog?.data?.InvoiceMasterData, this.purchaseRequisitionMasterRequest);
      this.purchaseRequisitionMasterRequest.PurchaseRequisitionDate = DateHelperService.getDatePickerFormat(_configDialog?.data?.InvoiceMasterData?.PurchaseRequisitionDate);
      this._purchaseRequisitionService.getPurchaseRequisitionDetailById(this.purchaseRequisitionMasterRequest.PurchaseRequisitionMasterId)
        .subscribe((invoiceDetail: PurchaseRequisitionMasterRequest) => {
          
          this.purchaseRequisitionMasterRequest.PurchaseRequisitionDetailRequest = invoiceDetail.PurchaseRequisitionDetailRequest;
        });
    }
  }

  ngOnInit(): void {
    this.getItemList();
  }

  private getItemList() {
    this._itemsQuery.itemsList$.subscribe((items: ItemRequest[]) => {
      this.itemsList = items;
    });
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

  public submit(f: NgForm, isToPrint: boolean) {
    if (!f.invalid) {
      let request: PurchaseRequisitionMasterRequest = new PurchaseRequisitionMasterRequest();
      CommonHelperService.mapSourceObjToDestination(this.purchaseRequisitionMasterRequest, request);
      request.PurchaseRequisitionDate = DateHelperService.getServerDateFormat(request.PurchaseRequisitionDate);

      if (request.PurchaseRequisitionMasterId > 0) {
        this.updatePurchaseRequisition(request, isToPrint);
      }
      else {
        this.addPurchaseRequisition(request, isToPrint);
      }
    }
    else {
      this._messageService.add({ severity: 'warn', summary: 'Form Fields are invalid', detail: 'Validation failed' });
    }
  }

  private addPurchaseRequisition(request: PurchaseRequisitionMasterRequest, isToPrint: boolean) {
    this._purchaseRequisitionService.addPurchaseRequisition(request).subscribe(
      (x: PurchaseRequisitionMasterRequest) => {
        if (x.PurchaseRequisitionMasterId > 0) {
          this._messageService.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          isToPrint ? this.printPurchaseRequisition(x.PurchaseRequisitionMasterId) : false;
          this.Close(true);
        }
      }
    );
  }

  private updatePurchaseRequisition(request: PurchaseRequisitionMasterRequest, isToPrint: boolean) {
    this._purchaseRequisitionService.updatePurchaseRequisition(request).subscribe(
      (x: PurchaseRequisitionMasterRequest) => {
        if (x.PurchaseRequisitionMasterId > 0) {
          this._messageService.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          isToPrint ? this.printPurchaseRequisition(x.PurchaseRequisitionMasterId) : false;
          this.Close(true);
        }
      }
    );
  }

  public printPurchaseRequisition(purchaseRequisitionMasterId: number) {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._purchaseRequisitionService
      .PurchaseRequisitionReport(purchaseRequisitionMasterId).subscribe(reportResponse => {
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

  public addPurchaseRequisitionDetail() {
    if (this.addPurchaseRequisitionDetailObj.Quantity > 0) {
      //in if condition we check if item already exist in detail and get specific detail and update it
      const matchingDetail = this.purchaseRequisitionMasterRequest?.PurchaseRequisitionDetailRequest
        .find((detail: PurchaseRequisitionDetailRequest) =>
          detail.ItemId === this.addPurchaseRequisitionDetailObj.ItemId);

      if (matchingDetail) {
        this._messageService.add({ severity: 'warn', summary: 'Item Exist', detail: 'Selected Item is already in list we are increasing its quantity' });
        let updatedDetail: PurchaseRequisitionDetailRequest = matchingDetail;
        updatedDetail.Quantity += this.addPurchaseRequisitionDetailObj.Quantity
        // updatedDetail.Total = updatedDetail.Quantity * updatedDetail.Price;
        const index = this.purchaseRequisitionMasterRequest.PurchaseRequisitionDetailRequest.indexOf(matchingDetail);
        this.purchaseRequisitionMasterRequest.PurchaseRequisitionDetailRequest[index] = updatedDetail;
      }
      else {
        
        if (this.purchaseRequisitionMasterRequest?.PurchaseRequisitionMasterId > 0) {
          this.addPurchaseRequisitionDetailObj.PurchaseRequisitionMasterId = this.purchaseRequisitionMasterRequest.PurchaseRequisitionMasterId;
        }

        this.purchaseRequisitionMasterRequest.PurchaseRequisitionDetailRequest.unshift(this.addPurchaseRequisitionDetailObj);
        this.addPurchaseRequisitionDetailObj = new PurchaseRequisitionDetailRequest();
        this.selectedItem = new ItemRequest();
      }
    } else {
      this._messageService.add({ severity: 'error', summary: 'Quantity', detail: 'Please select item and quatity must be greaten than zero' });
    }

  }

  deletePurchanseRequisitionDetail(index: number) {
    this.purchaseRequisitionMasterRequest.PurchaseRequisitionDetailRequest.splice(index, 1);
  }

  onItemChange() {
    this.addPurchaseRequisitionDetailObj.ItemId = this.selectedItem.ItemId;
    this.addPurchaseRequisitionDetailObj.ItemName = this.selectedItem.ItemName;
    this.addPurchaseRequisitionDetailObj.UnitName = this.selectedItem.UnitName;
  }
}
