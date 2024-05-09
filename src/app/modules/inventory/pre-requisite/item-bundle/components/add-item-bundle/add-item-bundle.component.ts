import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ItemBundleService } from '../../services/item-bundle.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BundleRequest } from '../models/item-bundle.model';
import { ItemRequest } from '../../../items/models/items.model';
import { NgForm } from '@angular/forms';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { ItemsQuery } from '../../../items/states/items.query';
import { BundleQuery } from '../../states/bundle.query';

@Component({
  selector: 'app-add-item-bundle',
  templateUrl: './add-item-bundle.component.html',
  styleUrls: ['./add-item-bundle.component.scss']
})
export class AddItemBundleComponent implements OnInit {

  public bundleMasterRequest: BundleRequest = new BundleRequest();
  public itemsList: ItemRequest[] = [];

  public selectedItem: ItemRequest = new ItemRequest();

  bundle: BundleRequest = new BundleRequest();
  itemToastIdKey = "";
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _itemBundleService: ItemBundleService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _itemsQuery: ItemsQuery,
    private _bundleQuery: BundleQuery,
    private _confirmationService: ConfirmationService,
  ) {

    this.bundle = _configDialog?.data ?? new BundleRequest();
    if (this.bundle.BundleId > 0) {
      this.bundleMasterRequest.BundleName = this.bundle.BundleName;
      this.bundleMasterRequest.Description = this.bundle.Description;
      this.bundleMasterRequest.BundleId = this.bundle.BundleId;
    }

    if (this.bundle.BundleId > 0) {
      this._itemBundleService.getBundleDetailById(this.bundle.BundleId).subscribe(
        (master: ItemRequest[]) => {
          if (master) {
            this.bundleMasterRequest.Items = master;
          }
        }
      )
    }
  }

  ngOnInit(): void {
    this._itemsQuery.itemsList$.subscribe(
      (data: ItemRequest[]) => {
        if (data.length > 0) {
          data.forEach(v => {
            let item = new ItemRequest();
            CommonHelperService.mapSourceObjToDestination(v, item);
            this.itemsList.push(item);
          });
        }
      }
    );
  }

  public Close(successfull?: boolean) {
    this._configDialogRef.close(successfull);
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: BundleRequest = new BundleRequest();
      CommonHelperService.mapSourceObjToDestination(this.bundleMasterRequest, request);
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      if (request.Items?.length > 0) {
        this.UpdateInvoice(request)
      }
      else {
        this._service.add({ severity: 'error', summary: 'Bundle details are incorrect', detail: 'Bundle details are incorrect' });
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private UpdateInvoice(request: BundleRequest) {
    this._service.add({ severity: 'info', summary: 'Update', detail: 'Bundle is being saved' });

    this._itemBundleService.saveBundle(request).subscribe(
      (x: BundleRequest) => {
        if (x) {
          this._bundleQuery.removeBundleById(x.BundleId);
          this._bundleQuery.addBundle(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

  deleteBundleDetail(index: number, itemId: number) {
    this.itemToastIdKey = itemId.toString();
    setTimeout(() => {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete item ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.bundleMasterRequest.Items.splice(index, 1);
        },
        reject: () => {
        },
        key: itemId.toString()
      });
    }, 10);
  }

  addBundleDetail() {
    if (this.selectedItem) {
      this.bundleMasterRequest.Items.push(this.selectedItem);
      this.selectedItem = new ItemRequest();
    }
    else {
      this._service.add({ severity: 'error', summary: 'Detail', detail: 'Please Select Item' });
    }
  }
}
