import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductCategoryQuery } from '../states/product-category.query';
import { ProductCategoryRequest } from '../models/product-category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(
    private _http: HttpClient,
    private _productCategoryQuery: ProductCategoryQuery
  ) { }

  addProductCategory(request: ProductCategoryRequest): Observable<ProductCategoryRequest> {
    const url = `Production/AddProductCategory`;
    return this._http.post(url, request) as Observable<ProductCategoryRequest>;
  }
  updateProductCategory(request: ProductCategoryRequest): Observable<ProductCategoryRequest> {
    const url = `Production/UpdateProductCategory`;
    return this._http.post(url, request) as Observable<ProductCategoryRequest>;
  }

  removeProductCategory(productCategoryId: number): Observable<boolean> {
    const url = `Production/RemoveProductCategory?productCategoryId=${productCategoryId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getProductCategoryList(outletId: number) {
    const url = `Production/GetProductCategoryList?outletId=${outletId}`;
    this._http
      .get<ProductCategoryRequest[]>(url)
      .subscribe((data: ProductCategoryRequest[]) => {
        this._productCategoryQuery.setLoading(false);
        if (data?.length > 0) {
          this._productCategoryQuery.removeProductCategorytore();
          this._productCategoryQuery.addProductCategoryList(data);
        } else {
          this._productCategoryQuery.addProductCategoryList([]);
        }
        this._productCategoryQuery.selectLoading();
      });
  }
}
