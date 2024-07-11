import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ProductionProcessService } from '../services/production-process.service';
import { OrderMasterRequest } from '../../order/models/order.model';
import { OrderQuery } from '../../order/states/order.query';
import { EmployeeBasicRequest } from 'src/app/modules/payroll/employee/models/employee.model';
import { EmployeeQuery } from 'src/app/modules/payroll/employee/states/employee.query';
import { ProductionParameterRequest, ProductionProcessRequest } from '../models/production-process.model';
import { EntityStateEnum } from 'src/app/shared/enums/entity-state.enum';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';

@Component({
  selector: 'app-edit-receive-process',
  templateUrl: './edit-receive-process.component.html',
  styleUrls: ['./edit-receive-process.component.scss']
})
export class EditReceiveProcessComponent implements OnInit {
  public productionProcessList: ProductionProcessRequest[] = [];
  public orderList: OrderMasterRequest[] = [];
  public employeeList: EmployeeBasicRequest[] = [];
  public selectedEmployee: EmployeeBasicRequest = new EmployeeBasicRequest();
  productToastIdKey = "";
  mainProcessTypeId = 0;

  // master feilds
  orderMasterId = 0;
  receiveDate: any = new Date();

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _productionService: ProductionProcessService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _confirmationService: ConfirmationService,
    private _orderQuery: OrderQuery,
    private _employeeQuery: EmployeeQuery,
  ) {
    this.mainProcessTypeId = _configDialog?.data?.mainProcessTypeId;
  }

  ngOnInit(): void {
    this._orderQuery.orderList$.subscribe(
      (data: OrderMasterRequest[]) => {
        this.orderList = data;
      }
    );

    this._employeeQuery.employeeList$.subscribe(
      (data: EmployeeBasicRequest[]) => {
        this.employeeList = data;
      });
  }

  public close(successfull?: boolean) {
    this._configDialogRef.close(successfull);
  }

  public submit(f: NgForm) {
    if (this.productionProcessList.length > 0
      && this.orderMasterId > 0
      && this.selectedEmployee.EmployeeId > 0
      && this.receiveDate != ''
      && this.receiveDate != null) {
      let updatedEntities = this.productionProcessList.filter(r => r.EntityState == EntityStateEnum.Updated);
      updatedEntities.forEach(e => {
        e.ProductionDate = DateHelperService.getServerDateFormat(e.ProductionDate);
      });
      this.saveReceiveProcessList(updatedEntities);
    }
    else {
      this._service.add({ severity: 'error', summary: 'ProductionProcess details are incorrect', detail: 'ProductionProcess details are incorrect' });
    }
  }

  private saveReceiveProcessList(request: ProductionProcessRequest[]) {
    this._service.add({ severity: 'info', summary: 'Update', detail: 'ProductionProcess is being saved' });
    this._productionService.saveReceiveProcessList(request).subscribe(
      (x) => {
        if (x) {
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.close(true);
        } else {
          // this._service.add({ severity: 'error', summary: 'Please try again.', detail: 'Please fill correct Information.' });
          this.close();
        }
      }
    );
  }

  masterChange() {
    if (this.selectedEmployee.EmployeeId > 0 && this.orderMasterId > 0 && this.receiveDate != null) {
      let request = new ProductionParameterRequest();
      request.EmployeeId = this.selectedEmployee.EmployeeId;
      request.OrderMasterId = this.orderMasterId;
      request.OutletId = this._authQuery.PROFILE.CurrentOutletId;
      request.ToDate = DateHelperService.getServerDateFormat(this.receiveDate);
      this._productionService.getReceiveListByOrder(request).subscribe(res => {
        if (res?.length > 0) {
          this.productionProcessList = res;
        } else {
          this.productionProcessList = [];
          this._service.add({ severity: 'error', summary: 'Please try again.', detail: 'No data found with that order and employee on that date.' });
        }
      });
    }
  }

  onQuantityChange(process: ProductionProcessRequest) {
    process.EntityState = EntityStateEnum.Updated;
  }

  deleteProcess(index: number, process: ProductionProcessRequest) {
    this.productToastIdKey = `${process.ProductId}${process.ProcessId}`;
    setTimeout(() => {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete production ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          this.productionProcessList.splice(index, 1);
          if (process.ProductionProcessId > 0) {
            this._productionService.removeProductionProcess(process.ProductionProcessId).subscribe(res => {
              if (res) {
                if (this.productionProcessList.length == 0) {
                  this.close(true);
                }
              }
            });
          }
        },
        reject: () => {
        },
        key: `${process.ProductId}${process.ProcessId}`
      });
    }, 10);
  }
}
