import { Component, OnInit } from '@angular/core';
import { ItemTypeRequest } from '../../models/item-types.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ItemTypeQuery } from '../../states/item-types.query';
import { ItemTypesService } from '../../services/item-types.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';

@Component({
  selector: 'app-add-item-types',
  templateUrl: './add-item-types.component.html',
  styleUrls: ['./add-item-types.component.scss']
})
export class AddItemTypesComponent implements OnInit {

  itemType: ItemTypeRequest = new ItemTypeRequest()
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _itemTypesService: ItemTypesService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _itemTypeQuery: ItemTypeQuery
  ) {
    if (_configDialog?.data) {
      let itemTypeObject: ItemTypeRequest = new ItemTypeRequest();
      itemTypeObject.ItemTypeName = _configDialog?.data?.ItemTypeName;
      itemTypeObject.ItemTypeId = _configDialog?.data?.ItemTypeId;
      this.itemType = itemTypeObject;
    }
  }

  ngOnInit(): void {

  }

  public Close() {
    this._configDialogRef.close();
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: ItemTypeRequest = new ItemTypeRequest();
      request.ItemTypeId = this.itemType.ItemTypeId;
      request.ItemTypeName = this.itemType.ItemTypeName;
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      if (request.ItemTypeId > 0) {
        this.UpdateItemType(request);
      }
      else {
        this.addItemType(request);
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addItemType(request: ItemTypeRequest) {
    this._itemTypesService.addItemType(request).subscribe(
      (x: ItemTypeRequest) => {
        if (x) {
          this._itemTypeQuery.addItemType(x);
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.itemType = new ItemTypeRequest();
        }
      }
    );
  }

  private UpdateItemType(request: ItemTypeRequest) {
    this._itemTypesService.updateItemType(request).subscribe(
      (x: any) => {
        if (x) {
          this._itemTypeQuery.updateItemType(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }
}
