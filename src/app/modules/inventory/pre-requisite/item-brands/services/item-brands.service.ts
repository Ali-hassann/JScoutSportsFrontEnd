import { Injectable } from '@angular/core';
import { BrandRequest } from '../models/item-brands.model';
import { Observable } from 'rxjs';
import { ItemBrandsQuery } from '../states/item-brands.query';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemBrandsService {

  constructor(
    private _http: HttpClient,
    private _brandsQuery: ItemBrandsQuery
  ) { }

  addItemBrand(request: BrandRequest): Observable<BrandRequest> {
    const url = `Inventory/AddBrand`;
    return this._http.post(url, request) as Observable<BrandRequest>;
  }
  updateItemBrand(request: BrandRequest): Observable<BrandRequest> {
    const url = `Inventory/UpdateBrand`;
    return this._http.post(url, request) as Observable<BrandRequest>;
  }

  removeItemBrand(ItemBrandId: number): Observable<boolean> {
    const url = `Inventory/RemoveBrand?BrandId=${ItemBrandId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getItemBrandList(outletId: number) {
    const url = `Inventory/GetBrandList?outletId=${outletId}`;
    this._http
      .get<BrandRequest[]>(url)
      .subscribe((data: BrandRequest[]) => {
        this._brandsQuery.setLoading(false);
        if (data?.length > 0) {
          this._brandsQuery.addItemBrandList(data)
        } else {
          this._brandsQuery.addItemBrandList([]);
        }
        this._brandsQuery.selectLoading();
      });
  }
}
