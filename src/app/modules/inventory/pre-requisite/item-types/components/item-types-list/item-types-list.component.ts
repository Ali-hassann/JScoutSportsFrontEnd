import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ItemTypesService } from '../../services/item-types.service';
import { ItemTypeRequest } from '../../models/item-types.model';
import { AddItemTypesComponent } from '../add-item-types/add-item-types.component';
import { ItemTypeQuery } from '../../states/item-types.query';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-item-types-list',
  templateUrl: './item-types-list.component.html',
  styleUrls: ['./item-types-list.component.scss']
})
export class ItemTypesListComponent implements OnInit {

  itemTypeList: ItemTypeRequest[] = [];
  itemtypeToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _itemTypesService: ItemTypesService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _itemTypeQuery: ItemTypeQuery
  ) { }

  ngOnInit() {
    this._itemTypeQuery.itemTypeList$.subscribe(
      (data: ItemTypeRequest[]) => {
        if (data) {
          this.itemTypeList = data;
        }
      }
    )
  }
  
  addItemType(itemType?: ItemTypeRequest) {
    let dialogRef = this._dialogService.open(AddItemTypesComponent, {
      header: `${itemType?.ItemTypeId ?? 0 > 0 ? 'Edit' : 'Add'} Item Type`,
      data: itemType,
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteItemType(itemType: ItemTypeRequest) {
    this.itemtypeToastIdKey = itemType.ItemTypeId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete item type?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._itemTypesService.removeItemType(itemType.ItemTypeId).subscribe(
            (x: boolean) => {
              if (x) {
                this._itemTypeQuery.removeItemTypeById(itemType.ItemTypeId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Type Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: itemType.ItemTypeId.toString()
      });
    }, 10);

  }
}
