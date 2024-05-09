import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ProductCategoryRequest } from '../../models/product-category.model';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductCategoryQuery } from '../../states/product-category.query';

@Component({
  selector: 'app-add-product-category',
  templateUrl: './add-product-category.component.html',
  styleUrls: ['./add-product-category.component.scss']
})
export class AddProductCategoryComponent implements OnInit {

  productCategory: ProductCategoryRequest = new ProductCategoryRequest();

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _productCategoryService: ProductCategoryService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _productCategoryQuery: ProductCategoryQuery
  ) {
    
    if (_configDialog?.data) {
      let categoryObj: ProductCategoryRequest = new ProductCategoryRequest();
      categoryObj.ProductCategoryId = _configDialog?.data?.ProductCategoryId;
      categoryObj.ProductCategoryName = _configDialog?.data?.ProductCategoryName;
      this.productCategory = categoryObj;
    }
  }

  ngOnInit(): void {
  }

  public Close() {
    this._configDialogRef.close();
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: ProductCategoryRequest = new ProductCategoryRequest();
      request.ProductCategoryName = this.productCategory.ProductCategoryName;
      request.ProductCategoryId = this.productCategory.ProductCategoryId;
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      if (request.ProductCategoryId > 0) {
        this.UpdateProductCategory(request);
      }
      else {
        this.addProductCategory(request);
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addProductCategory(request: ProductCategoryRequest) {
    this._productCategoryService.addProductCategory(request).subscribe(
      (x: ProductCategoryRequest) => {
        if (x) {
          this._productCategoryQuery.addProductCategory(x);
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

  private UpdateProductCategory(request: ProductCategoryRequest) {
    this._productCategoryService.updateProductCategory(request).subscribe(
      (x: any) => {
        if (x) {
          this._productCategoryQuery.updateProductCategory(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

}
