import { Component, OnInit } from '@angular/core';
import { ProductSizeRequest } from '../../models/product-size.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductSizeQuery } from '../../states/product-size.query';
import { Table } from 'primeng/table';
import { ProductSizeService } from '../../services/product-size.service';
import { AddProductSizeComponent } from '../add-product-size/add-product-size.component';

@Component({
  selector: 'app-product-size-list',
  templateUrl: './product-size-list.component.html',
  styleUrls: ['./product-size-list.component.scss']
})
export class ProductSizeListComponent implements OnInit {

  productSizeList: ProductSizeRequest[] = [];
  productSizeToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _productSizeService: ProductSizeService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _productSizeQuery: ProductSizeQuery
  ) { }

  ngOnInit() {
    this._productSizeQuery.productSizeList$.subscribe(
      (data: ProductSizeRequest[]) => {
        if (data) {
          this.productSizeList= data;
        }
      }
    );
  }
  
  addProductSize(itemProductSize?: ProductSizeRequest) {
    let dialogRef = this._dialogService.open(AddProductSizeComponent, {
      header: `${itemProductSize?.ProductSizeId ?? 0 > 0 ? 'Edit' : 'Add'} Product Size`,
      data: itemProductSize,
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteProductSize(itemProductSize: ProductSizeRequest) {
    this.productSizeToastIdKey = itemProductSize.ProductSizeId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete Product Size?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._productSizeService.removeProductSize(itemProductSize.ProductSizeId).subscribe(
            (x: boolean) => {
              if (x) {
                this._productSizeQuery.removeProductSizeById(itemProductSize.ProductSizeId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Size Deleted Successfully', life: 3000 });
              }
            }
          );
        },
        reject: () => {
        },
        key: itemProductSize.ProductSizeId.toString()
      });
    }, 10);
  }
}
