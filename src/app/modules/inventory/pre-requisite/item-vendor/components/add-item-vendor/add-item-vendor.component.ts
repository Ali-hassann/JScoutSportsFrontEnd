import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { ItemVendorService } from '../../services/item-vendor.service';
import { ItemVendorRequest } from '../../models/item-vendor.model';
import { ParticularQuery } from 'src/app/modules/inventory/item-particular/states/item-paticular.query';
import { ParticularRequest } from 'src/app/modules/inventory/item-particular/models/item-particular.model';

@Component({
  selector: 'app-add-item-vendor',
  templateUrl: './add-item-vendor.component.html',
  styleUrls: ['./add-item-vendor.component.scss']
})
export class AddItemVendorComponent implements OnInit {

  itemVendor: ItemVendorRequest = new ItemVendorRequest();
  selectedVendor: ParticularRequest = new ParticularRequest();
  vendorDetailList: ItemVendorRequest[] = [];
  vendorList: ParticularRequest[] = [];
  price = 0;

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _itemVendorService: ItemVendorService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _particularQuery: ParticularQuery
  ) {
    if (_configDialog?.data) {
      let categoryObj: ItemVendorRequest = new ItemVendorRequest();
      categoryObj.ItemId = _configDialog?.data?.ItemId;
      this.itemVendor = categoryObj;
    }
  }

  ngOnInit(): void {
    if (this._configDialog?.data?.TotalParticulars > 0) {
      this._service.add({ severity: 'info', summary: 'Loading ...', detail: 'Data is being fetching.' });
      this._itemVendorService.getItemVendorListByItemId(this._configDialog?.data?.ItemId)
        .subscribe(res => {
          this._service.clear();
          this._service.add({ severity: 'success', summary: 'Sucessfully', detail: 'Fetched Sucessfully' });
          if (res.length > 0) {
            this.vendorDetailList = res;
          }
        });
    }

    this._particularQuery.VendorList$.subscribe(
      (data: ParticularRequest[]) => {
        if (data) {
          this.vendorList = data;
        }
      }
    )
  }

  public Close(isToRefresh: boolean = false) {
    this._configDialogRef.close(isToRefresh);
  }

  addParticular() {
    if (this.selectedVendor.ParticularId > 0) {
      let vendor = new ItemVendorRequest();
      vendor.ParticularId = this.selectedVendor.ParticularId;
      vendor.ParticularName = this.selectedVendor.ParticularName;
      vendor.ContactNo = this.selectedVendor.ContactNo;
      vendor.Price = this.price;
      vendor.ItemId = this._configDialog.data?.ItemId;
      vendor.OutletId = this._configDialog.data?.OutletId;
      this.vendorDetailList.push(vendor);
      this.price = 0;
      this.selectedVendor = new ParticularRequest();
    }
  }

  deleteVendor(itemVendor: ItemVendorRequest) {
    let index = this.vendorDetailList.indexOf(itemVendor);
    if (index > -1) {
      this.vendorDetailList.splice(index, 1);
    }
  }

  public saveParticular() {
    this._service.add({ severity: 'info', summary: 'Loading ...', detail: 'Data is being saving.' });
    this._itemVendorService.saveItemVendor(this.vendorDetailList).subscribe(
      (x: boolean) => {
        this._service.clear();
        if (x) {
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close(true);
        }
      }
    )
  }
}
