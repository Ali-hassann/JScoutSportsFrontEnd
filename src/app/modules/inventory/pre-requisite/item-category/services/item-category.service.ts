import { Injectable } from '@angular/core';
import { ItemCategoryRequest } from '../models/item-category.model';
import { Observable } from 'rxjs';
import { ItemCategoryQuery } from '../states/item-category.query';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemCategoryService {

  constructor(
    private _http: HttpClient,
    private _itemCategoryQuery: ItemCategoryQuery
  ) { }

  addItemCategory(request: ItemCategoryRequest): Observable<ItemCategoryRequest> {
    const url = `Inventory/AddItemCategory`;
    return this._http.post(url, request) as Observable<ItemCategoryRequest>;
  }
  updateItemCategory(request: ItemCategoryRequest): Observable<ItemCategoryRequest> {
    const url = `Inventory/UpdateItemCategory`;
    return this._http.post(url, request) as Observable<ItemCategoryRequest>;
  }

  removeItemCategory(itemCategoryId: number): Observable<boolean> {
    const url = `Inventory/RemoveItemCategory?itemCategoryId=${itemCategoryId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getItemCategoryList(outletId: number) {
    const url = `Inventory/GetItemCategoryList?outletId=${outletId}`;
    this._http
      .get<ItemCategoryRequest[]>(url)
      .subscribe((data: ItemCategoryRequest[]) => {
        this._itemCategoryQuery.setLoading(false);
        if (data?.length > 0) {
          this._itemCategoryQuery.addItemCategoryList(data)
        } else {
          this._itemCategoryQuery.addItemCategoryList([]);
        }
        this._itemCategoryQuery.selectLoading();
      });
  }
}
