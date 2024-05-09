import { Component, OnInit } from '@angular/core';
import { PlaningMasterRequest } from '../models/planing.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PlaningService } from '../../services/planing.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PlaningMasterQuery } from '../../states/planing.query';
import { Table } from 'primeng/table';
import { AddItemPlaningComponent } from '../add-item-planing/add-item-planing.component';

@Component({
  selector: 'app-planing-list',
  templateUrl: './planing-list.component.html'
})
export class PlaningListComponent implements OnInit {

  planingMasterList: PlaningMasterRequest[] = [];
  itemToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _itemsService: PlaningService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _planingMasterQuery: PlaningMasterQuery
  ) { }

  ngOnInit() {
    this._planingMasterQuery.planingMasterList$.subscribe(
      (data: PlaningMasterRequest[]) => {
        if (data) {
          this.planingMasterList = data;
        }
      }
    )
  }

  addPlaningMaster(planingMaster?: PlaningMasterRequest) {
    let dialogRef = this._dialogService.open(AddItemPlaningComponent, {
      header: `Edit ${planingMaster?.ProductName} Planing`,
      data: planingMaster,
      maximizable: true,
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deletePlaningMaster(planingMaster: PlaningMasterRequest) {
    this.itemToastIdKey = planingMaster.PlaningMasterId.toString();
    setTimeout(() => {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete planing ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._itemsService.removePlaningMaster(planingMaster.PlaningMasterId).subscribe(
            (x: boolean) => {
              if (x) {
                this._planingMasterQuery.removePlaningMasterById(planingMaster.PlaningMasterId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: `Planing Deleted Successfully`, life: 3000 });
              }
            }
          );
        },
        reject: () => {
        },
        key: planingMaster.PlaningMasterId.toString()
      });
    }, 10);
  }
}
