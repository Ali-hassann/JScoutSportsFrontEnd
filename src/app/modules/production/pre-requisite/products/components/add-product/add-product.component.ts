import { Component, OnInit } from '@angular/core';
import { ProductCategoryRequest } from '../../../product-category/models/product-category.model';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductCategoryQuery } from '../../../product-category/states/product-category.query';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { ProductRequest } from '../../models/product.model';
import { UnitRequest } from 'src/app/modules/inventory/pre-requisite/item-units/models/item-units.model';
import { ProductService } from '../../services/product.service';
import { ProductQuery } from '../../states/product.query';
import { UnitsQuery } from 'src/app/modules/inventory/pre-requisite/item-units/states/item-units.query';
import { AddProductCategoryComponent } from '../../../product-category/components/add-product-category/add-product-category.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})

export class AddProductComponent implements OnInit {
  product: ProductRequest = new ProductRequest();
  productCategoryList: ProductCategoryRequest[] = [];
  unitList: UnitRequest[] = [];
  isProductAlreadyExist: boolean = false;
  constructor(
    private _authQuery: AuthQuery,
    private _productsService: ProductService,
    public _configDialogRef: DynamicDialogRef,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _dialogService: DialogService,
    private _productQuery: ProductQuery,
    private _productCategoryQuery: ProductCategoryQuery,
    private _unitsQuery: UnitsQuery
  ) {
    if (this._configDialog?.data?.ProductId > 0) {
      CommonHelperService.mapSourceObjToDestination(this._configDialog?.data, this.product);
    }
  }

  ngOnInit(): void {
    this.getCategoryList();
    this.gettingDataFromStores();
  }

  gettingDataFromStores() {
    this._unitsQuery.unitsList$.subscribe(
      (data: UnitRequest[]) => {
        if (data) {
          this.unitList = data;
        }
      }
    )
  }

  getCategoryList() {
    this._productCategoryQuery.productCategoryList$.subscribe(
      (data: ProductCategoryRequest[]) => {
        if (data) {
          this.productCategoryList = data;
        }
      }
    );
  }

  public Close() {
    this._configDialogRef.close();
  }

  addCategory() {
    let dialogRef = this._dialogService.open(AddProductCategoryComponent, {
      header: 'Add Article Category',
      data: null,
      // width: '60%'
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.getCategoryList();
      }
    });
  }

  public submit(f: NgForm) {

    if (!f.invalid) {
      this.product.OutletId = this._authQuery?.PROFILE?.OutletId;
      if (this.product?.ProductId > 0) {
        this.UpdateProduct();
      }
      else {
        this.addProduct();
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addProduct() {
    this._productsService.addProduct(this.product).subscribe(
      (x: ProductRequest) => {
        if (x) {
          this._productQuery.addProduct(x);
          this.product.Color = "";
          this.product.CostPrice = 0;
          this.product.IsActive = true;
          this.product.PartNo = "";
          this.product.ProductId = 0;
          this.product.ProductName = "";
          this.product.SalePrice = 0;
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
        }
      }
    )
  }

  private UpdateProduct() {
    this._productsService.updateProduct(this.product).subscribe(
      (x: ProductRequest) => {
        if (x) {
          this._productQuery.updateProduct(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

  checkProductDuplication(productName: string) {
    this.isProductAlreadyExist = this._productQuery.checkProductDuplication(productName);
  }
}
