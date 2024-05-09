import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { ProcessRequest } from '../../models/process.model';
import { ProcessService } from '../../services/process.service';
import { ProcessQuery } from '../../states/process.query';
import { ProductRequest } from '../../../products/models/product.model';
import { ProductQuery } from '../../../products/states/product.query';

@Component({
  selector: 'app-transfer-Process',
  templateUrl: './transfer-Process.component.html'
})
export class TransferProcessComponent implements OnInit {
  productList: ProductRequest[] = [];
  fromProductId = 0;
  toProductIds: number[] = [];

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _processService: ProcessService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _processQuery: ProcessQuery,
    private _productQuery: ProductQuery
  ) {
    if (_configDialog?.data > 0) {
      this.fromProductId = _configDialog?.data;
    }
  }

  ngOnInit(): void {

    this._productQuery.productList$.subscribe(data => {
      if (data?.length > 0) {
        this.productList = data;
      }
    });
  }

  public Close() {
    this._configDialogRef.close();
  }

  public transferProcess() {
    this._processService.transferProcess(this.fromProductId, this.toProductIds).subscribe(
      (x: boolean) => {
        if (x) {
          this._processQuery.removeProcesstore();
          this._processService.getProcessListForStore();
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
        }
      }
    )
  }
}
