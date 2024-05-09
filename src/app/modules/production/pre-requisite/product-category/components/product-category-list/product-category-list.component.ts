import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ProductCategoryRequest } from '../../models/product-category.model';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductCategoryQuery } from '../../states/product-category.query';
import { AddProductCategoryComponent } from '../add-product-category/add-product-category.component';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent implements OnInit {

  productCategoryList: ProductCategoryRequest[] = [];
  productCategoryToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _ProductCategoryService: ProductCategoryService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _productCategoryQuery: ProductCategoryQuery
  ) { }

  ngOnInit() {

    this._productCategoryQuery.productCategoryList$.subscribe(
      (data: ProductCategoryRequest[]) => {
        if (data) {
          this.productCategoryList = data;
        }
      }
    )
  }

  addProductCategory(productCategory?: ProductCategoryRequest) {
    let dialogRef = this._dialogService.open(AddProductCategoryComponent, {
      header: `${productCategory?.ProductCategoryId ?? 0 > 0 ? 'Edit' : 'Add'} Product Category`,
      data: productCategory,
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteProductCategory(productCategory: ProductCategoryRequest) {
    this.productCategoryToastIdKey = productCategory.ProductCategoryId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete product category?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._ProductCategoryService.removeProductCategory(productCategory.ProductCategoryId).subscribe(
            (x: boolean) => {
              if (x) {
                this._productCategoryQuery.removeProductCategoryById(productCategory.ProductCategoryId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Category Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: productCategory.ProductCategoryId.toString()
      });
    }, 10);

  }
}
