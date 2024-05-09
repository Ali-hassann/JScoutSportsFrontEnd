import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductRequest } from '../models/product.model';
import { ProductQuery } from '../states/product.query';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(
    private _http: HttpClient,
    private _productQuery: ProductQuery
  ) { }

  addProduct(request: ProductRequest): Observable<ProductRequest> {
    const url = `Production/AddProduct`;
    return this._http.post(url, request) as Observable<ProductRequest>;
  }
  updateProduct(request: ProductRequest): Observable<ProductRequest> {
    const url = `Production/UpdateProduct`;
    return this._http.post(url, request) as Observable<ProductRequest>;
  }

  removeProduct(productId: number): Observable<boolean> {
    const url = `Production/RemoveProduct?productId=${productId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getProductList(outletId: number) {
    const url = `Production/GetProductList?outletId=${outletId}`;
    this._http
      .get<ProductRequest[]>(url)
      .subscribe((data: ProductRequest[]) => {
        this._productQuery.setLoading(false);
        if (data?.length > 0) {
          this._productQuery.removeProductStore();
          this._productQuery.addProductList(data);
        } else {
          this._productQuery.addProductList([]);
        }
        this._productQuery.selectLoading();
      });
  }

  productReport() {
    let url = `Reports/PrintProducts`;
    return this._http.get(url, { observe: "response", responseType: "blob" });
  }
}
