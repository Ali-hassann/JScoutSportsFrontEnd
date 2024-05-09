import { Component, OnInit } from '@angular/core';
import { UnitRequest } from '../../models/item-units.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UnitsQuery } from '../../states/item-units.query';
import { ItemUnitsService } from '../../services/item-units.service';
import { AddItemUnitsComponent } from '../add-item-units/add-item-units.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-item-units-list',
  templateUrl: './item-units-list.component.html',
  styleUrls: ['./item-units-list.component.scss']
})
export class ItemUnitsListComponent implements OnInit {

  unitList: UnitRequest[] = [];
  unitToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _itemUnitsService: ItemUnitsService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _itemTypeQuery: UnitsQuery
  ) { }

  ngOnInit() {
    this._itemTypeQuery.unitsList$.subscribe(
      (data: UnitRequest[]) => {
        if (data) {
          this.unitList= data;
        }
      }
    )
  }
  
  addItemUnit(itemUnit?: UnitRequest) {
    let dialogRef = this._dialogService.open(AddItemUnitsComponent, {
      header: `${itemUnit?.UnitId ?? 0 > 0 ? 'Edit' : 'Add'} Item Unit`,
      data: itemUnit,
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteItemUnit(itemUnit: UnitRequest) {
    this.unitToastIdKey = itemUnit.UnitId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete itemUnit?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._itemUnitsService.removeUnit(itemUnit.UnitId).subscribe(
            (x: boolean) => {
              if (x) {
                this._itemTypeQuery.removeUnitById(itemUnit.UnitId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Unit Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: itemUnit.UnitId.toString()
      });
    }, 10);

  }

}
