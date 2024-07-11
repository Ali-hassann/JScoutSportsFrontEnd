import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ProcessRequest, ProductionFilterRequest } from '../../models/process.model';
import { ProcessService } from '../../services/process.service';
import { ProductRequest } from '../../../products/models/product.model';
import { ProductQuery } from '../../../products/states/product.query';
import { EntityStateEnum } from 'src/app/shared/enums/entity-state.enum';
import { OrderMasterRequest } from 'src/app/modules/production/order/models/order.model';
import { OrderQuery } from 'src/app/modules/production/order/states/order.query';
import { ProcessTypeQuery } from '../../../process-type/states/process-type.query';
import { ProductSizeRequest } from '../../../item-units/models/product-size.model';
import { ProductSizeQuery } from '../../../item-units/states/product-size.query';

@Component({
  selector: 'app-add-Process',
  templateUrl: './add-Process.component.html'
})
export class AddProcessComponent implements OnInit {

  productIds: number[] = [];
  sizeIds: number[] = [];
  orderMasterId: number = 0;
  processList: ProcessRequest[] = [];
  productList: ProductRequest[] = [];
  productSizeList: ProductSizeRequest[] = [];
  orderList: OrderMasterRequest[] = [];
  selectAll = false;
  isReadOnly = false;

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _processService: ProcessService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _productQuery: ProductQuery,
    private _productSizeQuery: ProductSizeQuery,
    private _orderQuery: OrderQuery,
    private _processTypeQuery: ProcessTypeQuery,
  ) {
    if ((_configDialog?.data?.productId ?? 0) > 0) {
      this.orderMasterId = _configDialog?.data.orderMasterId;
      // this.productList = 
      if (_configDialog?.data.productId > 0 && _configDialog?.data.productSizeId > 0) {
        this.isReadOnly = true;
        this.productIds.push(_configDialog?.data.productId);
        this.sizeIds.push(_configDialog?.data.productSizeId);
      }
    }
  }

  ngOnInit(): void {
    this._productQuery.productList$.subscribe(data => {
      if (data?.length > 0) {
        this.productList = data;
      }
    });

    this._productSizeQuery.productSizeList$.subscribe(data => {
      if (data?.length > 0) {
        this.productSizeList = data;
      }
    });

    this._orderQuery.orderList$.subscribe(data => {
      if (data?.length > 0) {
        this.orderList = data;
      }
    });

    this.getProcessList();
  }

  private getProcessList() {
    let request: ProductionFilterRequest = new ProductionFilterRequest();
    request.OrderMasterId = this.orderMasterId;
    request.ProductSizeId = this.sizeIds[0];
    request.ProductId = this.productIds[0];
    this._service.add({ severity: 'info', summary: 'Loading ...', detail: 'Please wait data is being getting.' });

    this._service.add({})
    if (request.ProductSizeId > 0) {
      this._processService.getProcessListByProduct(request).subscribe(res => {
        this._service.clear();
        this._service.add({ severity: 'success', summary: 'Sucessfully', detail: 'Sucessfully get data', life: 3000 });
        if (res?.length > 0) {
          this.processList = res;
        }
      });
    } else {
      this.processList = [];
      this._processTypeQuery.processTypeList$.subscribe(
        res => {
          if (res.length > 0) {
            res.forEach(pro => {
              let process = new ProcessRequest();
              process.ProcessTypeId = pro.ProcessTypeId;
              process.MainProcessTypeId = pro.MainProcessTypeId;
              process.ProcessTypeName = pro.ProcessTypeName;
              // process.ProductId = ;
              process.OrderMasterId = this.orderMasterId;
              this.processList.push(process);
            });
          }
        }
      );
    }
  }

  onProductChange() {
    this.getProcessList();
  }

  onOrderChange() {
    this.getProcessList();
  }
  public Close(isToRefresh: boolean) {
    this._configDialogRef.close(isToRefresh);
  }

  onSingleSelectChange(event: any, process: ProcessRequest) {
    process.Selected = event.checked;
  }

  onSelectAllChange(event: any) {
    this.processList.forEach(r => {
      if (event.checked && r.ProcessId == 0) {
        r.EntityState = EntityStateEnum.Inserted;
      } else if (event.checked && r.ProcessId > 0) {
        r.EntityState = EntityStateEnum.Updated;
      }
      r.Selected = event.checked
    });
  }

  onProcessChange(process: ProcessRequest) {
    process.OrderMasterId = this.orderMasterId
    if (process?.ProcessId == 0) {
      process.EntityState = EntityStateEnum.Inserted;
    } else if (process?.ProcessId > 0) {
      process.EntityState = EntityStateEnum.Updated;
    } else {
      process.EntityState = EntityStateEnum.UnChange;
    }
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      this.saveProcess();
    }
  }

  private saveProcess() {
    this._service.add({ severity: 'info', summary: 'Loading ...', detail: 'Please wait data is being saving.' });
    let processListToSave: ProcessRequest[] = [];
    this.productIds.forEach(productId => {
      this.sizeIds.forEach(size => {
        this.processList.forEach(r => {
          if (r.Selected) {
            let cell: ProcessRequest = new ProcessRequest();
            cell.OrderMasterId = this.orderMasterId;
            cell.Description = r.Description;
            cell.OtherRate = r.OtherRate;
            cell.ProcessRate = r.ProcessRate;
            cell.Selected = r.Selected;
            cell.ProcessTypeId = r.ProcessTypeId;
            cell.ProductId = productId;
            cell.ProductSizeId = size;
            processListToSave.push(cell);
          }
        });
      });
    });

    this._processService.saveProcess(processListToSave).subscribe(
      (x: boolean) => {
        this._service.clear();
        if (x) {
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully', life: 3000 });
          this.Close(false);
        }
      }
    )
  }
}
