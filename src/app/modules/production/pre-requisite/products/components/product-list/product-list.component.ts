import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductQuery } from '../../states/product.query';
import { AddProductComponent } from '../add-product/add-product.component';
import { Table } from 'primeng/table';
import { ProductService } from '../../services/product.service';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { ProductRequest } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productList: ProductRequest[] = [];
  productToastIdKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _productService: ProductService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _productQuery: ProductQuery,
    private _fileViewerService: FileViewerService
  ) { }

  ngOnInit() {
    this._productQuery.productList$.subscribe(
      (data: ProductRequest[]) => {
        if (data) {
          this.productList = data;
        }
      }
    )
  }

  addProduct(product?: ProductRequest) {
    let dialogRef = this._dialogService.open(AddProductComponent, {
      header: `${product?.ProductId ?? 0 > 0 ? 'Edit' : 'Add'} Product`,
      data: product,
      width: '60%'
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteProduct(product: ProductRequest) {
    this.productToastIdKey = product.ProductId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete product?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._productService.removeProduct(product.ProductId).subscribe(
            (x: boolean) => {
              if (x) {
                this._productQuery.removeProductById(product.ProductId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: product.ProductId.toString()
      });
    }, 10);
  }

  printProductList() {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._productService
      .productReport().subscribe(reportResponse => {
        if (reportResponse) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });
          this._fileViewerService.loadFileViewer(reportResponse);
        }
        else {
          this._messageService.clear();
          this._messageService.add({ severity: 'info', summary: 'Info', detail: 'No record found for selected criteria', life: 3000 });
        }
      });
  }
}