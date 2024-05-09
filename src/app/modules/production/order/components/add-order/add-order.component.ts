import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { ParticularRequest } from 'src/app/modules/inventory/item-particular/models/item-particular.model';
import { ParticularQuery } from 'src/app/modules/inventory/item-particular/states/item-paticular.query';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { OrderDetailRequest, OrderMasterRequest } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { ProductRequest } from '../../../pre-requisite/products/models/product.model';
import { ProductQuery } from '../../../pre-requisite/products/states/product.query';
import { OrderQuery } from '../../states/order.query';
import { ProductSizeRequest } from '../../../pre-requisite/item-units/models/product-size.model';
import { ProductSizeQuery } from '../../../pre-requisite/item-units/states/product-size.query';
import { AddProcessComponent } from '../../../pre-requisite/process/components/add-process/add-process.component';
import { AddItemPlaningComponent } from '../../../pre-requisite/planing/components/add-item-planing/add-item-planing.component';
import { AddProductComponent } from '../../../pre-requisite/products/components/add-product/add-product.component';
import { AddItemVendorsComponent } from 'src/app/modules/inventory/item-particular/components/add-item-vendors/add-item-vendors.component';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {

  orderMasterRequest: OrderMasterRequest = new OrderMasterRequest();
  addOrderDetailObj: OrderDetailRequest = new OrderDetailRequest();
  productList: ProductRequest[] = [];
  productIds: number[] = [];
  productSizeList: ProductSizeRequest[] = [];
  particularList: ParticularRequest[] = [];

  backEndDetailSaved: OrderDetailRequest[] = [];
  bindingArray: any[][] = [];

  isQuantitySelected = true;

  toggleTooltip(show: boolean, cell: OrderDetailRequest): void {
    cell.isShowIcon = show;
  }

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _orderService: OrderService,
    public _configDialog: DynamicDialogConfig,
    private _messageService: MessageService,
    public _dialogService: DialogService,
    private _productQuery: ProductQuery,
    private _productSizeQuery: ProductSizeQuery,
    private _orderQuery: OrderQuery,
    private _particularQuery: ParticularQuery,
    private _fileViewerService: FileViewerService,

  ) {
    if (_configDialog?.data?.InvoiceMasterData?.OrderMasterId > 0) {
      CommonHelperService.mapSourceObjToDestination(_configDialog?.data?.InvoiceMasterData, this.orderMasterRequest);
      this.orderMasterRequest.OrderDate = DateHelperService.getDatePickerFormat(_configDialog?.data?.InvoiceMasterData?.OrderDate);
      this.orderMasterRequest.DeliveryDate = DateHelperService.getDatePickerFormat(_configDialog?.data?.InvoiceMasterData?.DeliveryDate);
      this._orderService.getOrderDetailById(this.orderMasterRequest.OrderMasterId)
        .subscribe((orderDetail: OrderDetailRequest[]) => {
          this.orderMasterRequest.OrderDetailsRequest = orderDetail;
          this.backEndDetailSaved = orderDetail;


          orderDetail.forEach(product => {
            if ((this.productIds?.findIndex(e => e === product.ProductId) ?? 0) == -1) {
              this.productIds.push(product.ProductId);
            }
          });

          this.generateMatrix();
        });
    }
  }

  ngOnInit(): void {
    this.getProductList();

    this.getParticularList();

    this._productSizeQuery.productSizeList$.subscribe(res => {
      this.productSizeList = res;
    });

    if (this.productSizeList?.length > 0) {
      this.generateMatrix();
    }
  }

  private getParticularList() {
    this._particularQuery.CustomerList$.subscribe((particulars: ParticularRequest[]) => {
      this.particularList = particulars;
    });
  }

  private getProductList() {
    this._productQuery.productList$.subscribe((product: ProductRequest[]) => {
      this.productList = product;
    });
  }

  private generateMatrix() {
    this.bindingArray = [];
    if (this.productSizeList.length > 0 && this.productIds.length > 0) {
      this.productIds.forEach(productId => {
        let row: any[] = [];
        this.productSizeList.forEach(size => {
          let savedDetail = this.backEndDetailSaved.find(x => x.ProductSizeId === size.ProductSizeId && x.ProductId === productId)
            ?? new OrderDetailRequest();
          let detail = new OrderDetailRequest();
          detail.ProductSizeId = size.ProductSizeId;
          detail.ProductSizeName = size.ProductSizeName;
          detail.ProductId = productId;
          detail.ProductName = this.productList?.find(r => r.ProductId === productId)?.ProductName ?? "";
          detail.OrderMasterId = this.orderMasterRequest.OrderMasterId;
          detail.Quantity = savedDetail.Quantity;
          detail.Amount = savedDetail.Amount;
          detail.Price = savedDetail.Price;

          row.push(detail);
        });
        this.bindingArray.push(row);
      });
    }
  }

  public Close(successfull?: boolean) {
    this._configDialogRef.close(successfull);
  }

  addCustomer() {
    let dialogRef = this._dialogService.open(AddItemVendorsComponent, {
      header: 'Add Customer',
      data: { particularType: "Customer" },
      width: '60%'
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.getParticularList();
      }
    });
  }

  addArticle() {
    let dialogRef = this._dialogService.open(AddProductComponent, {
      header: 'Add Article',
      data: null,
      width: '60%'
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.getProductList();
      }
    });
  }

  prepareDataForSave() {
    let listToSave: any[] = [];
    // const totalRows = this.productSizeList.length;
    // const totalCols = this.productColorList.length;

    // for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    //   for (let colIndex = 0; colIndex < totalCols; colIndex++) {
    //     const colorId = this.productColorList[colIndex].ProductColorId;
    //     const sizeId = this.productSizeList[rowIndex].ProductSizeId;
    //     const detail = this.bindingArray[rowIndex]?.find(item => item.ProductColorId === colorId
    //       && item.ProductSizeId === sizeId) ?? new OrderDetailRequest();

    //     if (detail.Quantity > 0) {
    //       listToSave.push(detail);
    //     }
    //   }
    // }
    this.bindingArray.forEach(col => {
      col.forEach(cell => {
        if (cell.Quantity > 0) {
          listToSave.push(cell);
        }
      });
    })
    if (listToSave.length > 0) {
      this.orderMasterRequest.OrderDetailsRequest = listToSave;
    }
  }

  public submit(f: NgForm, isToPrint: boolean) {
    if (!f.invalid && this.orderMasterRequest.ParticularId) {
      let request: OrderMasterRequest = new OrderMasterRequest();
      this.prepareDataForSave();
      CommonHelperService.mapSourceObjToDestination(this.orderMasterRequest, request);
      request.OrderDate = DateHelperService.getServerDateFormat(request.OrderDate);
      request.DeliveryDate = DateHelperService.getServerDateFormat(request.DeliveryDate);
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      request.TotalAmount = CommonHelperService.getSumofArrayPropert(request.OrderDetailsRequest,"");

      if (request.OrderDetailsRequest.length === 0) {
        this._messageService.add({ severity: 'warn', summary: 'Please define Quantity', detail: 'Validation failed' });
      } else {
        if (request.OrderMasterId > 0) {
          this.updateOrder(request, isToPrint);
        }
        else {
          this.addOrder(request, isToPrint);
        }
      }

      request.TotalAmount = CommonHelperService.getSumofArrayPropert(request.OrderDetailsRequest, "Amount");
    }
    else {
      this._messageService.add({ severity: 'warn', summary: 'Form Fields are invalid', detail: 'Validation failed' });
    }
  }

  private addOrder(request: OrderMasterRequest, isToPrint: boolean) {
    this._orderService.addOrder(request).subscribe(
      (x: OrderMasterRequest) => {
        if (x.OrderMasterId > 0) {
          this._messageService.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          isToPrint ? this.printOrder(x.OrderMasterId) : false;
          this._orderQuery.addOrder(x);
          this.Close(true);
        }
      }
    );
  }

  private updateOrder(request: OrderMasterRequest, isToPrint: boolean) {
    this._orderService.updateOrder(request).subscribe(
      (x: OrderMasterRequest) => {
        if (x.OrderMasterId > 0) {
          this._messageService.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          isToPrint ? this.printOrder(x.OrderMasterId) : false;
          this._orderQuery.updateOrder(x);
          this.Close(true);
        }
      }
    );
  }

  public printOrder(orderMasterId: number) {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._orderService
      .OrderReport(orderMasterId).subscribe(reportResponse => {
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

  // public addOrderDetail() {
  //   this.addOrderDetailObj.ProductId = this.selectedProduct?.ProductId;
  //   this.addOrderDetailObj.ProductName = this.selectedProduct?.ProductName;
  //   this.addOrderDetailObj.ProductSizeId = this.selectedProductSize?.ProductSizeId;
  //   this.addOrderDetailObj.ProductSizeName = this.selectedProductSize?.ProductSizeName;
  //   this.addOrderDetailObj.ProductColorId = this.selectedProductColor.ProductColorId;
  //   this.addOrderDetailObj.ProductColorName = this.selectedProductColor.ProductColorName;
  //   this.addOrderDetailObj.UnitName = this.selectedProduct?.UnitName;

  //   if (this.addOrderDetailObj.Quantity > 0) {
  //     this.addOrderDetailObj.Amount = this.addOrderDetailObj.Quantity * this.addOrderDetailObj.Price;
  //     if (this.orderMasterRequest?.OrderMasterId > 0) {
  //       this.addOrderDetailObj.OrderMasterId = this.orderMasterRequest.OrderMasterId;
  //     }

  //     this.orderMasterRequest.OrderDetailsRequest.unshift(this.addOrderDetailObj);
  //     this.addOrderDetailObj = new OrderDetailRequest();
  //     this.selectedProductSize = new ProductSizeRequest();
  //     this.selectedProductColor = new ProductColorRequest();

  //     this.orderMasterSummaryUpdate();
  //   } else {
  //     this._messageService.add({ severity: 'error', summary: 'Quantity', detail: 'Please select article and quatity must be greaten than zero' });
  //   }
  // }

  defineProcess(detail?: OrderDetailRequest) {
    let dialogRef = this._dialogService.open(AddProcessComponent, {
      header: `Add Process `,
      data: {
        productId: (detail?.ProductId ?? 0) > 0 ? detail?.ProductId : 0
        , orderMasterId: this.orderMasterRequest?.OrderMasterId
        , productSizeId: (detail?.ProductSizeId ?? 0) > 0 ? detail?.ProductSizeId : 0
        , productSizeList: this.productSizeList
      },
      width: "80%",
      height: "100%"
    });
  }

  definePlaning(detail?: OrderDetailRequest) {
    let dialogRef = this._dialogService.open(AddItemPlaningComponent, {
      header: `Add Planing `,
      data: {
        productId: (detail?.ProductId ?? 0) > 0 ? detail?.ProductId : 0
        , orderMasterId: this.orderMasterRequest?.OrderMasterId
        , productSizeId: (detail?.ProductSizeId ?? 0) > 0 ? detail?.ProductSizeId : 0
        , productSizeList: this.productSizeList
      },
      width: "80%",
      height: "100%"
    });
  }

  orderMasterSummaryUpdate() {
    this.orderMasterRequest.TotalAmount = CommonHelperService.getSumofArrayPropert(this.orderMasterRequest.OrderDetailsRequest, 'Amount');
    // this.orderMasterRequest.NetAmount = this.orderMasterRequest.TotalAmount - this.orderMasterRequest.Discount;
    // this.orderMasterRequest.BalanceAmount = this.orderMasterRequest.NetAmount - this.orderMasterRequest.PaidReceivedAmount;
  }

  deletePurchanseOrderDetail(index: number) {
    this.orderMasterRequest.OrderDetailsRequest.splice(index, 1);
    this.orderMasterSummaryUpdate();
  }

  onDetailChange(cell: OrderDetailRequest, quantity: number, price: number) {
    cell.Quantity = quantity;
    this.bindingArray.forEach(r => {
      r.filter(t => t.ProductSizeId === cell.ProductSizeId
        && t.ProductId === cell.ProductId)
        ?.forEach(y => {
          y.Quantity = quantity;
          y.Price = price;
          y.Amount = quantity*price;
        });
    });
  }

  onProductListChange() {
    // this.addOrderDetailObj.ProductId = this.selectedProduct?.ProductId;
    // this.addOrderDetailObj.ProductName = this.selectedProduct?.ProductName;
    // this.addOrderDetailObj.UnitName = this.selectedProduct?.UnitName;
    // this.addOrderDetailObj.Price = 0;
    // this.addOrderDetailObj.ProductSizeId = 0;
    this.generateMatrix();
  }
}