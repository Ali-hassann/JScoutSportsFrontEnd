import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ProductSizeRequest } from '../../models/product-size.model';
import { ProductSizeService } from '../../services/product-size.service';
import { ProductSizeQuery } from '../../states/product-size.query';

@Component({
  selector: 'app-add-product-size',
  templateUrl: './add-product-size.component.html',
  styleUrls: ['./add-product-size.component.scss']
})
export class AddProductSizeComponent implements OnInit {

  productSize: ProductSizeRequest = new ProductSizeRequest()
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _productSizeService: ProductSizeService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _productSizeQuery: ProductSizeQuery
  ) {
    if (_configDialog?.data) {
      let itemTypeObject: ProductSizeRequest = new ProductSizeRequest();
      itemTypeObject.ProductSizeName = _configDialog?.data?.ProductSizeName;
      itemTypeObject.ProductSizeId = _configDialog?.data?.ProductSizeId;
      this.productSize = itemTypeObject;
    }
  }

  ngOnInit(): void {

  }

  public Close() {
    this._configDialogRef.close();
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: ProductSizeRequest = new ProductSizeRequest();
      request.ProductSizeId = this.productSize.ProductSizeId;
      request.ProductSizeName = this.productSize.ProductSizeName;
      if (request.ProductSizeId > 0) {
        this.UpdateProductSize(request);
      }
      else {
        this.addProductSize(request);
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addProductSize(request: ProductSizeRequest) {
    this._productSizeService.addProductSize(request).subscribe(
      (x: ProductSizeRequest) => {
        if (x) {
          this._productSizeQuery.addProductSize(x);
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.productSize = new ProductSizeRequest();
        }
      }
    )
  }

  private UpdateProductSize(request: ProductSizeRequest) {
    this._productSizeService.updateProductSize(request).subscribe(
      (x: any) => {
        if (x) {
          this._productSizeQuery.updateProductSize(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }
}
