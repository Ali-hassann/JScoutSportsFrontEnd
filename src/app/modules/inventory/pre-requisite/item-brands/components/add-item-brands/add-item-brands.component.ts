import { Component, OnInit } from '@angular/core';
import { BrandRequest } from '../../models/item-brands.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { ItemBrandsService } from '../../services/item-brands.service';
import { ItemBrandsQuery } from '../../states/item-brands.query';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-item-brands',
  templateUrl: './add-item-brands.component.html',
  styleUrls: ['./add-item-brands.component.scss']
})
export class AddItemBrandsComponent implements OnInit {

  itemBrand: BrandRequest = new BrandRequest()
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _itemBrandsService: ItemBrandsService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _itemBrandsQuery: ItemBrandsQuery
  ) {
    if (_configDialog?.data) {
      let itemTypeObject: BrandRequest = new BrandRequest();
      itemTypeObject.BrandName = _configDialog?.data?.BrandName;
      itemTypeObject.BrandId = _configDialog?.data?.BrandId;
      this.itemBrand = itemTypeObject;
    }
  }

  ngOnInit(): void {

  }

  public Close() {
    this._configDialogRef.close();
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: BrandRequest = new BrandRequest();
      request.BrandId = this.itemBrand.BrandId;
      request.BrandName = this.itemBrand.BrandName;
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      if (request.BrandId > 0) {
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

  private addItemType(request: BrandRequest) {
    this._itemBrandsService.addItemBrand(request).subscribe(
      (x: BrandRequest) => {
        if (x) {
          this._itemBrandsQuery.addItemBrand(x);
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

  private UpdateItemType(request: BrandRequest) {
    this._itemBrandsService.updateItemBrand(request).subscribe(
      (x: any) => {
        if (x) {
          this._itemBrandsQuery.updateItemBrand(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

}
