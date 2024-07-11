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
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { ProductionParameterRequest, ProductionProcessRequest } from '../models/production-process.model';
import { EntityStateEnum } from 'src/app/shared/enums/entity-state.enum';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';

@Component({
  selector: 'app-edit-issue-process',
  templateUrl: './edit-issue-process.component.html',
  styleUrls: ['./edit-issue-process.component.scss']
})
export class EditIssueProcessComponent implements OnInit {

  public productionProcessList: ProductionProcessRequest[] = [];
  public orderList: OrderMasterRequest[] = [];
  public employeeList: EmployeeBasicRequest[] = [];
  public selectedEmployee: EmployeeBasicRequest = new EmployeeBasicRequest();
  productToastIdKey = "";

  // master feilds
  orderMasterId = 0;
  issuanceNo = 0;
  issueDate: string | Date = new Date();

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _productionService: ProductionProcessService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _confirmationService: ConfirmationService,
    private _orderQuery: OrderQuery,
    private _employeeQuery: EmployeeQuery,
    private _fileViewerService: FileViewerService
  ) {
  }

  ngOnInit(): void {
    if (this._configDialog?.data?.productionProcess?.IssuanceNo > 0) {
      this.issuanceNo = this._configDialog?.data?.productionProcess?.IssuanceNo;
      this.orderMasterId = this._configDialog?.data?.productionProcess.OrderMasterId;
      this.issueDate = DateHelperService.getDatePickerFormat(this._configDialog?.data?.productionProcess.IssueDate) ?? new Date();
      this.getProcessListByIssueNo();
    }

    this._orderQuery.orderList$.subscribe(
      (data: OrderMasterRequest[]) => {
        this.orderList = data;
      }
    );

    this._employeeQuery.employeeList$.subscribe(
      (data: EmployeeBasicRequest[]) => {
        this.employeeList = data;
        if (this._configDialog?.data?.productionProcess?.EmployeeId > 0) {
          this.selectedEmployee = this.employeeList.find(e => e.EmployeeId == this._configDialog?.data?.productionProcess.EmployeeId) ?? new EmployeeBasicRequest();
        }
      }
    );
  }

  getProcessListByIssueNo() {
    this._productionService.getProcessListByIssueNo(this.issuanceNo).subscribe(data => {
      if (data?.length > 0) {
        this.productionProcessList = data;
      }
    })
  }

  public close(successfull?: boolean) {
    this._configDialogRef.close(successfull);
  }

  public submit(f: NgForm) {
    if (this.productionProcessList.length > 0
      && this.orderMasterId > 0
      && this.selectedEmployee.EmployeeId > 0
      && this.issueDate != ''
      && this.issueDate != null) {
      this.saveProductionProcess(this.productionProcessList);
    }
    else {
      this._service.add({ severity: 'error', summary: 'ProductionProcess details are incorrect', detail: 'ProductionProcess details are incorrect' });
    }
  }

  private saveProductionProcess(request: ProductionProcessRequest[]) {
    this._service.add({ severity: 'info', summary: 'Update', detail: 'ProductionProcess is being saved' });
    this._productionService.saveProductionProcess(request).subscribe(
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

  onQuantityChange(process: ProductionProcessRequest) {
    if (process.ProductionProcessId > 0 && this.issuanceNo > 0) {
      process.EntityState = EntityStateEnum.Updated;
    }
  }

  deleteDetail(index: number, process: ProductionProcessRequest) {
    this.productToastIdKey = `${process.ProductId}${process.ProcessId}`;
    setTimeout(() => {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete production ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          this.productionProcessList.splice(index, 1);
          if (process.ProductionProcessId > 0
            && process.IssuanceNo > 0
            && this.issuanceNo > 0) {
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

  printIssuanceSlip(process: ProductionProcessRequest) {
    let request = new ProductionParameterRequest();
    request.EmployeeId = process.EmployeeId;
    request.OrderMasterId = process.OrderMasterId;
    request.ProductId = process.ProductId;
    request.ProductSizeId = process.ProductSizeId;
    this._productionService.printIssueSlip(request).subscribe(res => {
      this._fileViewerService.loadFileViewer(res);
    });
  }
}
