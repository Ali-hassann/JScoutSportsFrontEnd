import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PlaningMasterRequest } from '../models/planing.model';
import { NgForm } from '@angular/forms';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { PlaningMasterQuery } from '../../states/planing.query';
import { PlaningService } from '../../services/planing.service';
import { ItemsQuery } from 'src/app/modules/inventory/pre-requisite/items/states/items.query';
import { ItemRequest } from 'src/app/modules/inventory/pre-requisite/items/models/items.model';
import { ProductRequest } from '../../../products/models/product.model';
import { ProductQuery } from '../../../products/states/product.query';
import { OrderMasterRequest } from 'src/app/modules/production/order/models/order.model';
import { OrderQuery } from 'src/app/modules/production/order/states/order.query';
import { UnitsQuery } from 'src/app/modules/inventory/pre-requisite/item-units/states/item-units.query';
import { UnitRequest } from 'src/app/modules/inventory/pre-requisite/item-units/models/item-units.model';
import { ProductionFilterRequest } from '../../../process/models/process.model';
import { ProductSizeRequest } from '../../../item-units/models/product-size.model';

@Component({
  selector: 'app-add-item-planing',
  templateUrl: './add-item-planing.component.html',
  styleUrls: ['./add-item-planing.component.scss']
})
export class AddItemPlaningComponent implements OnInit {

  public planingMasterRequest: PlaningMasterRequest = new PlaningMasterRequest();
  public itemList: ItemRequest[] = [];
  public unitList: UnitRequest[] = [];
  public productList: ProductRequest[] = [];
  public orderList: OrderMasterRequest[] = [];
  productSizeList: ProductSizeRequest[] = [];
  public selectedItem: ItemRequest = new ItemRequest();
  public selectedUnit: UnitRequest = new UnitRequest();
  itemToastIdKey = "";

  sizeIds: number[] = [];
  productIds: number[] = [];
  isReadOnly = false;

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _planingService: PlaningService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _confirmationService: ConfirmationService,
    private _itemsQuery: ItemsQuery,
    private _unitQuery: UnitsQuery,
    private _productQuery: ProductQuery,
    private _orderQuery: OrderQuery,
    private _planingMasterQuery: PlaningMasterQuery,
  ) {
    this.planingMasterRequest.ProductId = _configDialog?.data.productId;
    this.planingMasterRequest.OrderMasterId = _configDialog?.data.orderMasterId;
    this.productSizeList = _configDialog?.data.productSizeList
    if (_configDialog?.data.productId > 0 && _configDialog?.data.productSizeId > 0) {
      this.isReadOnly = true;
      this.productIds.push(_configDialog?.data.productId);
      this.sizeIds.push(_configDialog?.data.productSizeId);
      this.getPlaningDetail();
    }
  }

  private getPlaningDetail() {
    if (this.planingMasterRequest.ProductId > 0) {
      let request = new ProductionFilterRequest();
      request.ProductId = this.planingMasterRequest.ProductId;
      request.OrderMasterId = this.planingMasterRequest.OrderMasterId;
      request.OutletId = this.planingMasterRequest.OutletId;
      request.ProductId = this.productIds[0];
      request.ProductSizeId = this.sizeIds[0];

      this._planingService.getPlaningDetailById(request).subscribe(
        (detailList: ItemRequest[]) => {
          if (detailList) {
            this.planingMasterRequest.Items = detailList;
          }
        });
    }
  }

  ngOnInit(): void {
    this._itemsQuery.itemsList$.subscribe(
      (data: ItemRequest[]) => {
        data.forEach(s => {
          let item = new ItemRequest();
          CommonHelperService.mapSourceObjToDestination(s, item);
          this.itemList.push(item);
        });
      }
    );

    this._productQuery.productList$.subscribe(
      (x: ProductRequest[]) => {
        this.productList = x;
      }
    );

    this._orderQuery.orderList$.subscribe(
      (x: OrderMasterRequest[]) => {
        this.orderList = x;
      }
    );

    this._unitQuery.unitsList$.subscribe(data => {
      if (data?.length > 0) {
        this.unitList = data;
      }
    });
  }

  itemSelected() {
    this.selectedItem.Price = this.selectedItem.LastPrice;
    this.selectedItem.UnitId = 0;
    this.selectedItem.UnitName = "";
  }

  unitSelected() {
    this.selectedItem.UnitId = this.selectedUnit.UnitId;
    this.selectedItem.UnitName = this.selectedUnit.UnitName;
  }

  public Close(successfull?: boolean) {
    this._configDialogRef.close(successfull);
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: PlaningMasterRequest = new PlaningMasterRequest();
      CommonHelperService.mapSourceObjToDestination(this.planingMasterRequest, request);
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      request.PlaningMasterId = request.Items[0].PlaningMasterId;
      request.Amount = CommonHelperService.getSumofArrayPropert(request.Items, "Price");
      if (request.Items?.length > 0) {
        this.savePlaningMaster(request);
      }
      else {
        this._service.add({ severity: 'error', summary: 'PlaningMaster details are incorrect', detail: 'PlaningMaster details are incorrect' });
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private savePlaningMaster(request: PlaningMasterRequest) {
    let planingToSave: PlaningMasterRequest[] = [];
    this._service.add({ severity: 'info', summary: 'Saving', detail: 'Planing is being saved' });
    this.productIds.forEach(productId => {
      this.sizeIds.forEach(sizeId => {
        let planingMaster = new PlaningMasterRequest();
        request.Items.forEach(detail => {
          let detailToAdd = new ItemRequest();
          detailToAdd.ItemId = detail.ItemId;
          detailToAdd.UnitId = detail.UnitId;
          detailToAdd.UnitName = detail.UnitName;
          detailToAdd.ItemCategoryId = detail.ItemCategoryId;
          detailToAdd.ItemCategoryName = detail.ItemCategoryName;
          detailToAdd.Price = detail.Price;
          detailToAdd.IsManualPrice = detail.IsManualPrice;
          detailToAdd.Quantity = detail.Quantity;
          detailToAdd.LastPrice = detail.LastPrice;
          planingMaster.Items.push(detailToAdd);
        });

        planingMaster.Amount = request.Amount;
        planingMaster.OrderMasterId = request.OrderMasterId;
        planingMaster.OutletId = request.OutletId;
        planingMaster.ProductId = productId;
        planingMaster.ProductSizeId = sizeId;
        planingMaster.PlaningMasterId = 0;
        planingToSave.push(planingMaster);
      });
    });

    this._planingService.savePlaningMaster(planingToSave).subscribe(
      (x) => {
        if (x) {
          this._planingMasterQuery.removePlaningMasterStore();
          this._planingService.getPlaningMasterList(request.OutletId);
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Planing Saved Sucessfully' });
          this.Close();
        }
      }
    );
  }

  deleteVoucherDetail(index: number, itemId: number) {
    this.itemToastIdKey = itemId.toString();
    setTimeout(() => {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete planing ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          this.planingMasterRequest.Items.splice(index, 1);
        },
        reject: () => {
        },
        key: itemId.toString()
      });
    }, 10);
  }

  addPlaningDetail() {
    if (this.selectedItem) {
      this.planingMasterRequest.Items.push(this.selectedItem);
      this.selectedItem = new ItemRequest();
      this.selectedUnit = new UnitRequest();
    }
    else {
      this._service.add({ severity: 'error', summary: 'Detail', detail: 'Please Select Item' });
    }
  }
}
