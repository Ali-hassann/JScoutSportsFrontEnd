import { Component, OnInit } from '@angular/core';
import { ItemCategoryRequest } from '../../../item-category/models/item-category.model';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ItemCategoryQuery } from '../../../item-category/states/item-category.query';
import { ItemsService } from '../../services/items.service';
import { ItemRequest } from '../../models/items.model';
import { ItemsQuery } from '../../states/items.query';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { UnitsQuery } from '../../../item-units/states/item-units.query';
import { UnitRequest } from '../../../item-units/models/item-units.model';
import { AddItemCategoryComponent } from '../../../item-category/components/add-item-category/add-item-category.component';
import { AddItemUnitsComponent } from '../../../item-units/components/add-item-units/add-item-units.component';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent implements OnInit {

  item: ItemRequest = new ItemRequest();
  itemCategoryList: ItemCategoryRequest[] = [];
  unitList: UnitRequest[] = [];
  isItemAlreadyExist: boolean = false;
  constructor(
    private _authQuery: AuthQuery,
    private _itemsService: ItemsService,
    private _dialogService: DialogService,
    public _configDialogRef: DynamicDialogRef,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _itemQuery: ItemsQuery,
    private _itemCategoryQuery: ItemCategoryQuery,
    private _unitsQuery: UnitsQuery
  ) {

    if (this._configDialog?.data?.ItemId > 0) {
      CommonHelperService.mapSourceObjToDestination(this._configDialog?.data, this.item);
    }
  }

  ngOnInit(): void {
    this.gettingDataFromStores();
  }

  gettingDataFromStores() {
    this.getCategoryList();
    this.getUnitList();
  }

  private getUnitList() {
    this._unitsQuery.unitsList$.subscribe(
      (data: UnitRequest[]) => {
        if (data) {
          this.unitList = data;
        }
      }
    );
  }

  private getCategoryList() {
    this._itemCategoryQuery.itemCategoryList$.subscribe(
      (data: ItemCategoryRequest[]) => {
        if (data) {
          this.itemCategoryList = data;
        }
      }
    );
  }

  public Close() {
    this._configDialogRef.close();
  }

  addCategory() {
    let dialogRef = this._dialogService.open(AddItemCategoryComponent, {
      header: 'Add Category',
      data: null,
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.getCategoryList();
      }
    });
  }

  addUnit() {
    let dialogRef = this._dialogService.open(AddItemUnitsComponent, {
      header: 'Add Unit',
      data: null,
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.getUnitList();
      }
    });
  }

  public submit(f: NgForm) {

    if (!f.invalid) {
      this.item.OutletId = this._authQuery?.PROFILE?.OutletId;
      if (this.item?.ItemId > 0) {
        this.UpdateItem(this.item);
      }
      else {
        this.addItem(this.item);
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addItem(request: ItemRequest) {
    this._itemsService.addItem(request).subscribe(
      (x: ItemRequest) => {
        if (x) {
          this._itemQuery.addItem(x);
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

  private UpdateItem(request: ItemRequest) {
    this._itemsService.updateItem(request).subscribe(
      (x: ItemRequest) => {
        if (x) {
          this._itemQuery.updateItem(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

  checkItemDuplication(itemName: string) {
    this.isItemAlreadyExist = this._itemQuery.checkItemDuplication(itemName);
  }
}
