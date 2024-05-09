import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ProcessTypeRequest } from '../../models/process-type.model';
import { ProcessTypeService } from '../../services/process-type.service';
import { ProcessTypeQuery } from '../../states/process-type.query';
import { AddProcessTypeComponent } from '../add-process-type/add-process-type.component';

@Component({
  selector: 'app-process-type-list',
  templateUrl: './process-type-list.component.html'
})
export class ProcessTypeListComponent implements OnInit {

  processTypeList: ProcessTypeRequest[] = [];
  processTypeToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _ProcessTypeService: ProcessTypeService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _processTypeQuery: ProcessTypeQuery
  ) { }

  ngOnInit() {
    this._processTypeQuery.processTypeList$.subscribe(
      (data: ProcessTypeRequest[]) => {
        if (data) {
          this.processTypeList = data;
        }
      }
    )
  }

  addProcessType(processType?: ProcessTypeRequest) {
    let dialogRef = this._dialogService.open(AddProcessTypeComponent, {
      header: `${processType?.ProcessTypeId ?? 0 > 0 ? 'Edit' : 'Add'} Process Type`,
      data: processType,
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteProcessType(processType: ProcessTypeRequest) {
    this.processTypeToastIdKey = processType.ProcessTypeId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete ${processType.ProcessTypeName}?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._ProcessTypeService.removeProcessType(processType.ProcessTypeId).subscribe(
            (x: boolean) => {
              if (x) {
                this._processTypeQuery.removeProcessTypeById(processType.ProcessTypeId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Process Type Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: processType.ProcessTypeId.toString()
      });
    }, 10);

  }
}
