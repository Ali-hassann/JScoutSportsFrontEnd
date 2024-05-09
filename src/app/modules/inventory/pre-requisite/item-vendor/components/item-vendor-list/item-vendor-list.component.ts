import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ItemVendorService } from '../../services/item-vendor.service';
import { ItemVendorRequest } from '../../models/item-vendor.model';
import { AddItemVendorComponent } from '../add-item-vendor/add-item-vendor.component';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';

@Component({
  selector: 'app-item-vendor-list',
  templateUrl: './item-vendor-list.component.html',
  styleUrls: ['./item-vendor-list.component.scss']
})
export class ItemVendorListComponent implements OnInit {

  itemVendorList: ItemVendorRequest[] = [];
  itemVendorToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _itemVendorService: ItemVendorService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _breadcrumbService: AppBreadcrumbService,
  ) { }

  ngOnInit() {
    this.getItemVendorsList();
    this.setBreadCrumb();
  }

  public setBreadCrumb(): void {
    this._breadcrumbService.setBreadcrumbs([
      { label: 'Administrator' },
      { label: 'Item Vendors' },
    ]);
  }

  private getItemVendorsList() {
    this._itemVendorService.getItemVendorList().subscribe(res => {
      if (res?.length > 0) {
        this.itemVendorList = res;
      }
    });
  }

  addItemVendor(itemVendor?: ItemVendorRequest) {
    let dialogRef = this._dialogService.open(AddItemVendorComponent, {
      header: `Add ${itemVendor?.ItemName} Vendors`,
      data: itemVendor,
      width: '70%'
    });
    dialogRef.onClose.subscribe(
      (isToRefresh: boolean) => {
        if (isToRefresh) {
          this.getItemVendorsList();
        }
      });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteItemCategory(itemCategory: ItemVendorRequest) {
    this.itemVendorToastIdKey = itemCategory.ItemId.toString() + itemCategory.ItemParticularId.toString();
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete item category?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._itemVendorService.removeItemVendor(itemCategory.ItemId).subscribe(
            (x: boolean) => {
              if (x) {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Category Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: itemCategory.ItemId.toString()
      });
    }, 10);

  }
}
