import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ItemTypeQuery } from '../../../item-types/states/item-types.query';
import { ItemCategoryService } from '../../services/item-category.service';
import { AddItemCategoryComponent } from '../add-item-category/add-item-category.component';
import { Table } from 'primeng/table';
import { ItemCategoryQuery } from '../../states/item-category.query';
import { ItemCategoryRequest } from '../../models/item-category.model';

@Component({
  selector: 'app-item-category-list',
  templateUrl: './item-category-list.component.html',
  styleUrls: ['./item-category-list.component.scss']
})
export class ItemCategoryListComponent implements OnInit {

  itemCategoryList: ItemCategoryRequest[] = [];
  itemCategoryToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _ItemCategoryService: ItemCategoryService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _itemCategoryQuery: ItemCategoryQuery
  ) { }

  ngOnInit() {

    this._itemCategoryQuery.itemCategoryList$.subscribe(
      (data: ItemCategoryRequest[]) => {
        if (data) {
          this.itemCategoryList = data;
        }
      }
    )
  }

  addItemCategory(itemCategory?: ItemCategoryRequest) {
    let dialogRef = this._dialogService.open(AddItemCategoryComponent, {
      header: `${itemCategory?.ItemCategoryId ?? 0 > 0 ? 'Edit' : 'Add'} Item Category`,
      data: itemCategory,
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteItemCategory(itemCategory: ItemCategoryRequest) {
    this.itemCategoryToastIdKey = itemCategory.ItemCategoryId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete item category?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._ItemCategoryService.removeItemCategory(itemCategory.ItemCategoryId).subscribe(
            (x: boolean) => {
              if (x) {
                this._itemCategoryQuery.removeItemCategoryById(itemCategory.ItemCategoryId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Category Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: itemCategory.ItemCategoryId.toString()
      });
    }, 10);

  }
}
