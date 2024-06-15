import { Component, OnInit } from '@angular/core';
import { ItemRequest } from '../../models/items.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ItemsQuery } from '../../states/items.query';
import { AddItemsComponent } from '../add-items/add-items.component';
import { Table } from 'primeng/table';
import { ItemsService } from '../../services/items.service';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit {
  itemList: ItemRequest[] = [];
  itemToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _itemsService: ItemsService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _itemsQuery: ItemsQuery,
    private _fileViewerService: FileViewerService
  ) { }

  ngOnInit() {
    this.getItemList();
  }

  private getItemList() {
    this._itemsQuery.itemsList$.subscribe(
      (data: ItemRequest[]) => {
        if (data) {
          this.itemList = data;
        }
      }
    );
  }

  addItem(item?: ItemRequest) {
    let dialogRef = this._dialogService.open(AddItemsComponent, {
      header: `${item?.ItemId ?? 0 > 0 ? 'Edit' : 'Add'} Item`,
      data: item,
      width: '60%',
      height: '80%'
    });
    dialogRef.onClose.subscribe((isToRefresh: boolean) => {
      
      isToRefresh ? this.getItemList() : '';
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteItem(item: ItemRequest) {
    this.itemToastIdKey = item.ItemId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete item?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._itemsService.removeItem(item.ItemId).subscribe(
            (x: boolean) => {
              if (x) {
                this._itemsQuery.removeItemById(item.ItemId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: item.ItemId.toString()
      });
    }, 10);
  }

  printItemList() {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._itemsService
      .itemReport().subscribe(reportResponse => {
        if (reportResponse) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });
          this._fileViewerService.loadFileViewer(reportResponse);
        }
        else {
          this._messageService.clear();
          this._messageService.add({ severity: 'info', summary: 'Info', detail: 'No record found for selected criteria', life: 3000 });
        }
      });
  }
}