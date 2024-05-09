import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ProductionProcessService } from '../services/production-process.service';
import { ProductQuery } from '../../pre-requisite/products/states/product.query';
import { OrderDetailRequest, OrderMasterRequest } from '../../order/models/order.model';
import { OrderQuery } from '../../order/states/order.query';
import { EmployeeBasicRequest } from 'src/app/modules/payroll/employee/models/employee.model';
import { EmployeeQuery } from 'src/app/modules/payroll/employee/states/employee.query';
import { ProcessRequest } from '../../pre-requisite/process/models/process.model';
import { ProcessQuery } from '../../pre-requisite/process/states/process.query';
import { ProcessStatusEnum } from 'src/app/shared/enums/production-process-status';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { ProductionParameterRequest, ProductionProcessRequest } from '../models/production-process.model';
import { EntityStateEnum } from 'src/app/shared/enums/entity-state.enum';
import { OrderService } from '../../order/services/order.service';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { ProductSizeRequest } from '../../pre-requisite/item-units/models/product-size.model';
import { ProductRequest } from '../../pre-requisite/products/models/product.model';

@Component({
  selector: 'app-add-production-process',
  templateUrl: './add-production-process.component.html',
  styleUrls: ['./add-production-process.component.scss']
})
export class AddProductionComponent implements OnInit {

  public productionProcessList: ProductionProcessRequest[] = [];
  public productList: OrderDetailRequest[] = [];
  public selectedProduct: OrderDetailRequest = new OrderDetailRequest();
  public orderList: OrderMasterRequest[] = [];
  public employeeList: EmployeeBasicRequest[] = [];
  public selectedEmployee: EmployeeBasicRequest = new EmployeeBasicRequest();
  public processList: ProcessRequest[] = [];
  public selectedProcess: ProcessRequest = new ProcessRequest();
  productToastIdKey = "";
  mainProcessTypeId = 0;
  quantity = 0;
  bindingArray: any[][] = [];
  backEndIssuanceDetail: ProductionProcessRequest[] = [];
  productSizeList: ProductSizeRequest[] = [];

  // master feilds
  orderMasterId = 0;
  issueDate: string | Date = new Date();

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _productionService: ProductionProcessService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _confirmationService: ConfirmationService,
    private _productQuery: ProductQuery,
    private _orderQuery: OrderQuery,
    private _orderService: OrderService,
    private _employeeQuery: EmployeeQuery,
    private _processQuery: ProcessQuery,
    private _fileViewerService: FileViewerService
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
        if (this._configDialog?.data?.productionProcess?.EmployeeId > 0) {
          this.selectedEmployee = this.employeeList.find(e => e.EmployeeId == this._configDialog?.data?.productionProcess.EmployeeId) ?? new EmployeeBasicRequest();
        }
      }
    );
  }

  public close(successfull?: boolean) {
    this._configDialogRef.close(successfull);
  }

  public submit(f: NgForm) {
    if (this.orderMasterId > 0
      && this.selectedEmployee.EmployeeId > 0
      && this.issueDate != ''
      && this.issueDate != null) {
      this.prepareDataForSave();
      this.saveProductionProcess();
    }
    else {
      this._service.add({ severity: 'error', summary: 'ProductionProcess details are incorrect', detail: 'ProductionProcess details are incorrect' });
    }
  }

  private saveProductionProcess() {
    this._service.add({ severity: 'info', summary: 'Update', detail: 'ProductionProcess is being saved' });
    this._productionService.saveProductionProcess(this.productionProcessList).subscribe(
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

  prepareDataForSave() {
    let listToSave: any[] = [];
    this.bindingArray.forEach(col => {
      col.forEach((cell: ProductionProcessRequest) => {
        if (cell.IssueQuantity > 0) {
          cell.OrderMasterId = this.orderMasterId;
          cell.IssueDate = this.issueDate;
          cell.EmployeeId = this.selectedEmployee.EmployeeId;
          cell.EntityState = EntityStateEnum.Inserted;
          cell.OutletId = this._authQuery.OutletId;
          cell.ProcessTypeId = this.selectedProcess.ProcessTypeId;
          listToSave.push(cell);
        }
      });
    })
    if (listToSave.length > 0) {
      this.productionProcessList = listToSave;
    }
  }

  masterChange(isOrderChange?: boolean) {
    if (this.orderMasterId > 0) {
      this._orderService.getOrderDetailById(this.orderMasterId).subscribe(data => {
        if (data?.length > 0) {
          this.productList = data;
          this.setProcessList();
        } else {
          this._service.add({ severity: 'error', summary: 'Detail', detail: 'No Article In that order' });
        }
      });
    }
  }

  setProcessList() {
    this.selectedProcess = new ProcessRequest();
    this._processQuery.selectProcessListByOrderId(this.orderMasterId,this.mainProcessTypeId).subscribe(
      (data: ProcessRequest[]) => {
        this.processList = [];
        data.forEach(process => {
          this.processList.findIndex(r => r.ProcessTypeName === process.ProcessTypeName) === -1 ? this.processList.push(process) : "";;
        }
        );
      }
    );
    this.generateMatrix();
  }

  getOrderDetails() {
    let request = new ProductionParameterRequest();
    request.OrderMasterId = this.orderMasterId;
    request.ProcessTypeId = this.selectedProcess.ProcessTypeId;
    request.OutletId = this._authQuery.OutletId;
    this._productionService.getIssuanceListByOrder(request).subscribe(res => {
      this.productSizeList = [];
      this.productList = [];

      res.forEach(r => {
        let product = new OrderDetailRequest();
        product.ProductId = r.ProductId;
        product.ProductName = r.ProductName;

        let size = new ProductSizeRequest();
        size.ProductSizeId = r.ProductSizeId;
        size.ProductSizeName = r.ProductSizeName;

        if (r.ProductId > 0 && r.ProductSizeId > 0) {
          this.productSizeList.findIndex(d => d.ProductSizeName === r.ProductSizeName) === -1 ? this.productSizeList.push(size) : "";;
          this.productList.findIndex(d => d.ProductName === r.ProductName) === -1 ? this.productList.push(product) : "";;
        }
      });
      this.backEndIssuanceDetail = res;
      this.generateMatrix();
    });
  }

  onQuantityChange(process: ProductionProcessRequest) {
    // if (process.ProductionProcessId > 0 && this.issuanceNo > 0) {
    //   let processProduct = this.productList.find(e => e.ProductId == process.ProductId);
    //   if (processProduct?.ProductId ?? 0 > 0) {
    //     process.EntityState = EntityStateEnum.Updated;
    //     process.ProcessRate = 0;
    //   }
    // }
  }

  private generateMatrix() {
    this.bindingArray = [];
    if (this.productSizeList.length > 0 && this.productList.length > 0) {
      this.productList.forEach(product => {
        let row: any[] = [];
        this.productSizeList.forEach(size => {
          let savedDetail = this.backEndIssuanceDetail.find(x => x.ProductSizeId === size.ProductSizeId && x.ProductId === product.ProductId)
            ?? new ProductionProcessRequest();

          let detail = new ProductionProcessRequest();
          detail.ProductSizeId = size.ProductSizeId;
          detail.ProductSizeName = size.ProductSizeName;
          detail.ProductId = product?.ProductId;
          detail.ProductName = product?.ProductName;
          detail.OrderMasterId = this.orderMasterId;
          detail.IssueQuantity = savedDetail.IssueQuantity;
          detail.ProcessRate = savedDetail.ProcessRate;
          detail.IssueDate = this.issueDate;

          row.push(detail);
        });
        this.bindingArray.push(row);
      });
    }
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

  //   addProductionDetail(product: OrderDetailRequest) {
  //     let productToPush = new ProductionProcessRequest();
  //     if (product) {
  //       productToPush.OutletId = this._authQuery.PROFILE.CurrentOutletId;
  //       productToPush.EmployeeId = this.selectedEmployee.EmployeeId;
  //       productToPush.OrderMasterId = this.orderMasterId;
  //       productToPush.IssueDate = DateHelperService.getServerDateFormat(this.issueDate);
  //       productToPush.IssueQuantity = this.quantity;
  //       productToPush.Status = ProcessStatusEnum.Issuance;
  //       productToPush.IssuanceNo = this.issuanceNo;
  //       productToPush.EntityState = EntityStateEnum.Inserted;
  //       productToPush.ProductId = this.selectedProduct.ProductId;
  //       productToPush.ProductSizeId = this.selectedProduct.ProductSizeId;
  //       productToPush.ProductSizeName = this.selectedProduct.ProductSizeName;
  //       productToPush.ProductName = this.selectedProduct.ProductName;
  //       productToPush.ProductCategoryName = this.selectedProduct.ProductCategoryName;
  //       productToPush.UnitName = this.selectedProduct.UnitName;
  //       productToPush.ProcessTypeId = this.selectedProcess.ProcessTypeId;
  //       productToPush.ProcessTypeName = this.selectedProcess.ProcessTypeName;
  //       this.productionProcessList.push(productToPush);
  //       this.selectedProcess = new ProcessRequest();
  //       this.quantity = this.selectedProduct.Quantity;
  //     }
  //     else {
  //       this._service.add({ severity: 'error', summary: 'Detail', detail: 'Please Select Product' });
  //     }
  //   }
}
