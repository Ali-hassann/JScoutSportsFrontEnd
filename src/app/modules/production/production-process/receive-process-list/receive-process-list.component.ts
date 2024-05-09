import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ProductionProcessService } from '../services/production-process.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ProductionParameterRequest, ProductionProcessRequest } from '../models/production-process.model';
import { ProcessStatusEnum } from 'src/app/shared/enums/production-process-status';
import { EntityStateEnum } from 'src/app/shared/enums/entity-state.enum';
import { EditReceiveProcessComponent } from '../edit-receive-process/edit-receive-process.component';
import { EmployeeBasicRequest } from 'src/app/modules/payroll/employee/models/employee.model';
import { OrderMasterRequest } from '../../order/models/order.model';
import { OrderQuery } from '../../order/states/order.query';
import { EmployeeQuery } from 'src/app/modules/payroll/employee/states/employee.query';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';

@Component({
  selector: 'app-receive-process-list',
  templateUrl: './receive-process-list.component.html' 
})
export class ReceiveProcessListComponent implements OnInit {

  productionProcessList: ProductionProcessRequest[] = [];
  itemToastIdKey: string = "";
  @Input() mainProcessTypeId: number = 0;

  public orderList: OrderMasterRequest[] = [];
  public employeeList: EmployeeBasicRequest[] = [];
  public selectedEmployee: EmployeeBasicRequest = new EmployeeBasicRequest();
  public productionParameterRequest: ProductionParameterRequest = new ProductionParameterRequest();
  constructor(
    private _messageService: MessageService,
    private _productionService: ProductionProcessService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _authQuery: AuthQuery,
    private _orderQuery: OrderQuery,
    private _employeeQuery: EmployeeQuery,
  ) { }

  ngOnInit() {
    this._orderQuery.orderList$.subscribe(
      (data: OrderMasterRequest[]) => {
        this.orderList = data;
      }
    );

    this._employeeQuery.employeeList$.subscribe(
      (data: EmployeeBasicRequest[]) => {
        this.employeeList = data;
      }
    );
  }

  parameterChange() {
    this.productionParameterRequest.EmployeeId = this.selectedEmployee.EmployeeId;
    if (this.productionParameterRequest?.EmployeeId > 0 && this.productionParameterRequest?.OrderMasterId > 0) {
      this.getReceivingProcessList();
    }
  }

  submit() {
    var listToInsert = this.productionProcessList.filter(e => e.ReceiveDate != '' && e.ReceiveDate != null && e.ReceiveQuantity > 0);
    listToInsert.forEach(r => {
      r.Status = ProcessStatusEnum.Receivance;
      r.IssueQuantity = 0;
      r.ReceiveDate = DateHelperService.getServerDateFormat(r.ReceiveDate);
      r.EntityState = EntityStateEnum.Inserted;
      r.IssuanceNo = 0;
      r.ProductionProcessId = 0;
    });
    this._productionService.saveReceiveProcessList(listToInsert).subscribe(res => {
      if (res) {
        this.getReceivingProcessList();
      }
    });
  }

  private getReceivingProcessList() {
    this.productionParameterRequest.OutletId = this._authQuery.PROFILE.CurrentOutletId;
    this.productionParameterRequest.EmployeeId = this.selectedEmployee.EmployeeId;
    this._productionService.getReceivingProcessList(this.productionParameterRequest).subscribe(
      (data: ProductionProcessRequest[]) => {
        if (data) {
          this.productionProcessList = data;
        }
      }
    );
  }

  onQuantityChange(process: ProductionProcessRequest) {
    if (process.ReceiveQuantity > 0 && (process.ReceiveQuantity - (process.IssueQuantity - process.AlreadyReceiveQuantity) > 0)) {
      // show message you receive greater amount of issued
      this._messageService.add({ severity: 'error', summary: 'Receive Qty > Issue Qty', detail: 'Please Enter Valid Receive Quantity.' });
      process.ReceiveQuantity = 0;
    } else {
      process.EntityState = EntityStateEnum.Updated;
    }
  }

  editProductionProcess() {
    let dialogRef = this._dialogService.open(EditReceiveProcessComponent, {
      header: `Edit Production Receive`,
      data: { mainProcessTypeId: this.mainProcessTypeId },
      maximizable: true,
      height: "100%"
    });
    dialogRef.onClose.subscribe(res => {
      if (res) {
        this.getReceivingProcessList();
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
