import { Component, OnInit } from '@angular/core';
import { BundleRequest } from '../models/item-bundle.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ItemBundleService } from '../../services/item-bundle.service';
import { DialogService } from 'primeng/dynamicdialog';
import { BundleQuery } from '../../states/bundle.query';
import { AddItemBundleComponent } from '../add-item-bundle/add-item-bundle.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-item-bundle-list',
  templateUrl: './item-bundle-list.component.html',
  styleUrls: ['./item-bundle-list.component.scss']
})
export class ItemBundleListComponent implements OnInit {

  bundleList: BundleRequest[] = [];
  itemToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _itemsService: ItemBundleService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _bundleQuery: BundleQuery
  ) { }

  ngOnInit() {
    this._bundleQuery.bundleList$.subscribe(
      (data: BundleRequest[]) => {
        if (data) {
          this.bundleList = data;
        }
      }
    )
  }

  addBundle(bundle?: BundleRequest) {
    let dialogRef = this._dialogService.open(AddItemBundleComponent, {
      header: `${bundle?.BundleId ?? 0 > 0 ? `Edit ${bundle?.BundleName}` : 'Add Bundle'}`,
      data: bundle,
      maximizable: true,
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteBundle(bundle: BundleRequest) {
    this.itemToastIdKey = bundle.BundleId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete ${bundle.BundleName} ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._itemsService.removeBundle(bundle.BundleId).subscribe(
            (x: boolean) => {
              if (x) {
                this._bundleQuery.removeBundleById(bundle.BundleId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: `${bundle.BundleName} Deleted Successfully`, life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: bundle.BundleId.toString()
      });
    }, 10);
  }
}
