import { Injectable } from '@angular/core';
import { ProductSizeRequest } from '../models/product-size.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductSizeQuery } from '../states/product-size.query';

@Injectable({
  providedIn: 'root'
})
export class ProductSizeService {

  constructor(
    private _http: HttpClient,
    private _ProductSizeQuery: ProductSizeQuery
  ) { }

  addProductSize(request: ProductSizeRequest): Observable<ProductSizeRequest> {
    const url = `Production/AddProductSize`;
    return this._http.post(url, request) as Observable<ProductSizeRequest>;
  }
  updateProductSize(request: ProductSizeRequest): Observable<ProductSizeRequest> {
    const url = `Production/UpdateProductSize`;
    return this._http.post(url, request) as Observable<ProductSizeRequest>;
  }

  removeProductSize(productSizeId: number): Observable<boolean> {
    const url = `Production/RemoveProductSize?productSizeId=${productSizeId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getProductSizeList() {
    const url = `Production/GetProductSizeList`;
    this._http
      .get<ProductSizeRequest[]>(url)
      .subscribe((data: ProductSizeRequest[]) => {
        this._ProductSizeQuery.setLoading(false);
        if (data?.length > 0) {
          this._ProductSizeQuery.removeProductSizeStore();
          this._ProductSizeQuery.addProductSizeList(data);
        } else {
          this._ProductSizeQuery.addProductSizeList([]);
        }
        this._ProductSizeQuery.selectLoading();
      });
  }
}
