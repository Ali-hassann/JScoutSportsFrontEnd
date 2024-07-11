import { Component, OnInit } from '@angular/core';
import { ItemCategoryRequest } from '../../models/item-category.model';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { ItemCategoryService } from '../../services/item-category.service';
import { ItemCategoryQuery } from '../../states/item-category.query';
import { NgForm } from '@angular/forms';
import { ItemTypeRequest } from '../../../item-types/models/item-types.model';
import { ItemTypeQuery } from '../../../item-types/states/item-types.query';
import { AddItemTypesComponent } from '../../../item-types/components/add-item-types/add-item-types.component';

@Component({
  selector: 'app-add-item-category',
  templateUrl: './add-item-category.component.html',
  styleUrls: ['./add-item-category.component.scss']
})
export class AddItemCategoryComponent implements OnInit {

  itemCategory: ItemCategoryRequest = new ItemCategoryRequest();
  itemTypeList: ItemTypeRequest[] = [];

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _itemCategoryService: ItemCategoryService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _dialogService: DialogService,
    private _itemTypeQuery: ItemTypeQuery,
    private _itemCategoryQuery: ItemCategoryQuery
  ) {

    if (_configDialog?.data) {
      let categoryObj: ItemCategoryRequest = new ItemCategoryRequest();
      categoryObj.ItemCategoryId = _configDialog?.data?.ItemCategoryId;
      categoryObj.ItemCategoryName = _configDialog?.data?.ItemCategoryName;
      categoryObj.ItemTypeId = _configDialog?.data?.ItemTypeId;
      this.itemCategory = categoryObj;
    }
  }

  ngOnInit(): void {
    this.getItemTypeList();
  }

  private getItemTypeList() {
    this._itemTypeQuery.itemTypeList$.subscribe(
      (data: ItemTypeRequest[]) => {
        if (data) {
          this.itemTypeList = data;
        }
      }
    );
  }

  public Close() {
    this._configDialogRef.close();
  }

  addCategory() {
    let dialogRef = this._dialogService.open(AddItemTypesComponent, {
      header: 'Add Item Type',
      data: null,
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.getItemTypeList();
      }
    });
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: ItemCategoryRequest = new ItemCategoryRequest();
      request.ItemTypeId = this.itemCategory.ItemTypeId;
      request.ItemCategoryName = this.itemCategory.ItemCategoryName;
      request.ItemCategoryId = this.itemCategory.ItemCategoryId;
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      this._service.add({ severity: 'info', summary: 'Loading ...', detail: 'Data is being saving.' });
      if (request.ItemCategoryId > 0) {
        this.UpdateItemCategory(request);
      }
      else {
        this.addItemCategory(request);
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addItemCategory(request: ItemCategoryRequest) {
    this._itemCategoryService.addItemCategory(request).subscribe(
      (x: ItemCategoryRequest) => {
        if (x) {
          this._itemCategoryQuery.addItemCategory(x);
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.itemCategory = new ItemCategoryRequest();
        }
      }
    )
  }

  private UpdateItemCategory(request: ItemCategoryRequest) {
    this._itemCategoryService.updateItemCategory(request).subscribe(
      (x: any) => {
        if (x) {
          this._itemCategoryQuery.updateItemCategory(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

}
