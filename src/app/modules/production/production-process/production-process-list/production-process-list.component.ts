import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ProductionProcessService } from '../services/production-process.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AddProductionComponent } from '../add-production-process/add-production-process.component';
import { ProductionParameterRequest, ProductionProcessRequest } from '../models/production-process.model';
import { OrderMasterRequest } from '../../order/models/order.model';
import { EmployeeBasicRequest } from 'src/app/modules/payroll/employee/models/employee.model';
import { OrderQuery } from '../../order/states/order.query';
import { EmployeeQuery } from 'src/app/modules/payroll/employee/states/employee.query';
import { EditIssueProcessComponent } from '../edit-issue-process/edit-issue-process.component';

@Component({
  selector: 'app-production-process-list',
  templateUrl: './production-process-list.component.html'
})
export class ProductionProcessListComponent implements OnInit {

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
  ) {
    this.productionParameterRequest.ToDate = new Date();
    this.productionParameterRequest.FromDate = new Date();
    this.productionParameterRequest.FromDate.setDate(this.productionParameterRequest.ToDate.getDate() - 15);
  }

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
    if (this.selectedEmployee?.EmployeeId > 0 && this.productionParameterRequest?.OrderMasterId > 0) {
      this.getProductionProcessList();
    }
  }

  private getProductionProcessList() {
    this.productionParameterRequest.OutletId = this._authQuery.PROFILE.CurrentOutletId;
    this.productionParameterRequest.EmployeeId = this.selectedEmployee.EmployeeId;
    this._productionService.getProductionProcessList(this.productionParameterRequest).subscribe(
      (data: ProductionProcessRequest[]) => {
        if (data) {
          this.productionProcessList = data;
        }
      }
    );
  }

  addProductionProcess(productionProcess?: ProductionProcessRequest) {
    let dialogRef;
    
    if (productionProcess?.IssuanceNo ?? 0 > 0) {
      dialogRef = this._dialogService.open(EditIssueProcessComponent, {
        header: `Edit Issuance # ${productionProcess?.IssuanceNo}`,
        data: { mainProcessTypeId: this.mainProcessTypeId, productionProcess: productionProcess },
        maximizable: true,
        height: "100%",
      });
    } else {
      dialogRef = this._dialogService.open(AddProductionComponent, {
        header: 'Add Production Issuance',
        data: { mainProcessTypeId: this.mainProcessTypeId, productionProcess: productionProcess },
        maximizable: true,
        height: "100%",
        width: "90%"
      });
    }

    dialogRef.onClose.subscribe(res => {
      if (res) {
        this.getProductionProcessList();
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteProductionProcess(productionProcess: ProductionProcessRequest) {
    this.itemToastIdKey = productionProcess.ProductionProcessId.toString();
    setTimeout(() => {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete process of Issue # ${productionProcess.IssuanceNo}?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._productionService.removeProductionProcessByIssueNo(productionProcess.IssuanceNo).subscribe(
            (x: boolean) => {
              if (x) {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: `Production Deleted Successfully`, life: 3000 });
              }
            }
          );
        },
        reject: () => {
        },
        key: productionProcess.ProductionProcessId.toString()
      });
    }, 10);
  }
}
