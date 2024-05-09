import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ProcessRequest } from '../../models/process.model';
import { ProcessService } from '../../services/process.service';
import { ProcessQuery } from '../../states/process.query';
import { AddProcessComponent } from '../add-process/add-process.component';
import { TransferProcessComponent } from '../transfer-process/transfer-process.component';
import { OrderMasterRequest } from 'src/app/modules/production/order/models/order.model';
import { OrderQuery } from 'src/app/modules/production/order/states/order.query';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html'
})
export class ProcessListComponent implements OnInit {

  processList: ProcessRequest[] = [];
  processToastIdKey: string = "";
  orderList: OrderMasterRequest[] = [];
  orderMasterId: number = 0;

  constructor(
    private _messageService: MessageService,
    private _processService: ProcessService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _orderQuery: OrderQuery
  ) { }

  ngOnInit() {
    this.getProcesList();

    this._orderQuery.orderList$.subscribe(data => {
      if (data?.length > 0) {
        this.orderList = data;
      }
    });
  }

  private getProcesList() {
    this._processService.getProcessList().subscribe(
      (data: ProcessRequest[]) => {
        if (data) {
          this.processList = data;
        }
      }
    );
  }

  addProcess(process?: ProcessRequest) {
    let dialogRef = this._dialogService.open(AddProcessComponent, {
      header: `${process?.ProcessId ?? 0 > 0 ? 'Edit' : 'Add'} Process`,
      data: { productId: process?.ProductId, orderMasterId: process?.OrderMasterId },
      width: "80%",
      height: "80%"
    });
  }

  transferProcess(fromProductId?: number) {
    let dialogRef = this._dialogService.open(TransferProcessComponent, {
      header: `Transfer Process`,
      data: fromProductId,
      width: "50%"
    });
    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh) {
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onOrderChange() {
    this.getProcesList();
  }
}
