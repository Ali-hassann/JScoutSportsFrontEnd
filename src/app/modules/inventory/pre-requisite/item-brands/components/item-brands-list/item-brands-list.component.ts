import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BrandRequest } from '../../models/item-brands.model';
import { Table } from 'primeng/table';
import { ItemBrandsService } from '../../services/item-brands.service';
import { ItemBrandsQuery } from '../../states/item-brands.query';
import { AddItemBrandsComponent } from '../add-item-brands/add-item-brands.component';

@Component({
  selector: 'app-item-brands-list',
  templateUrl: './item-brands-list.component.html',
  styleUrls: ['./item-brands-list.component.scss']
})
export class ItemBrandsListComponent implements OnInit {

  itemBrandList: BrandRequest[] = [];
  itemBrandToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _itemTypesService: ItemBrandsService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _itemTypeQuery: ItemBrandsQuery
  ) { }

  ngOnInit() {
    this._itemTypeQuery.itemBrandList$.subscribe(
      (data: BrandRequest[]) => {
        if (data) {
          this.itemBrandList = data;
        }
      }
    )
  }
  
  addItemBrand(itemBrand?: BrandRequest) {
    let dialogRef = this._dialogService.open(AddItemBrandsComponent, {
      header: `${itemBrand?.BrandId ?? 0 > 0 ? 'Edit' : 'Add'} Item Brand`,
      data: itemBrand,
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteItemBrand(itemBrand: BrandRequest) {
    this.itemBrandToastIdKey = itemBrand.BrandId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete item brand?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._itemTypesService.removeItemBrand(itemBrand.BrandId).subscribe(
            (x: boolean) => {
              if (x) {
                this._itemTypeQuery.removeItemBrandById(itemBrand.BrandId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Brand Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: itemBrand.BrandId.toString()
      });
    }, 10);

  }
}
