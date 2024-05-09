import { Component, OnInit } from '@angular/core';
import { ItemOpeningRequest } from '../../models/item-opening.model';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ItemOpeningService } from '../../item-opening.service';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { Table } from 'primeng/table';
import { InventoryRights } from 'src/app/shared/enums/rights.enum';

@Component({
  selector: 'app-item-opening-list',
  templateUrl: './item-opening-list.component.html',
  styleUrls: ['./item-opening-list.component.scss']
})
export class ItemOpeningListComponent implements OnInit {
  public itemOpeningeList: ItemOpeningRequest[] = [];
  InventoryRights = InventoryRights;

  constructor(
    public _dialogService: DialogService,
    private _itemOpeningService: ItemOpeningService,
    private _authQuery: AuthQuery,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService,
    private _breadcrumbService: AppBreadcrumbService,
  ) {
  }

  public ngOnInit(): void {
    this.setBreadCrumb();
    this.getItemOpeingList();
  }

  private setBreadCrumb(): void {
    this._breadcrumbService.setBreadcrumbs([
      { label: 'Item Opening' },
    ]);
  }

  addItemOpening() {
    this._messageService.add({ severity: 'info', summary: 'Data is Saving', detail: 'Data is Saving' });
    this._itemOpeningService.saveItemOpening(this.itemOpeningeList).subscribe(res => {
      if (res) {
        this._messageService.clear();
        this._messageService.add({ severity: 'success', summary: 'Data is Saved', detail: 'Data is Saved' });
        this.getItemOpeingList();
      }
    });
  }

  getItemOpeingList() {
    this._messageService.add({ severity: 'info', summary: 'Data is getting', detail: 'Data is getting' });
    this._itemOpeningService.getItemOpeningList(this._authQuery.OutletId).subscribe(res => {
      res?.length > 0 ? this.itemOpeningeList = res : [];
    });
  }

  onOpeningChange(itemOpeing: ItemOpeningRequest) {

  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}