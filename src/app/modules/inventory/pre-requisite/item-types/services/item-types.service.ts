import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemTypeQuery } from '../states/item-types.query';
import { Observable } from 'rxjs';
import { ItemTypeRequest } from '../models/item-types.model';

@Injectable({
  providedIn: 'root'
})
export class ItemTypesService {

  constructor(
    private _http: HttpClient,
    private _itemTypeQuery: ItemTypeQuery
  ) { }

  addItemType(request: ItemTypeRequest): Observable<ItemTypeRequest> {
    const url = `Inventory/AddItemType`;
    return this._http.post(url, request) as Observable<ItemTypeRequest>;
  }
  updateItemType(request: ItemTypeRequest): Observable<ItemTypeRequest> {
    const url = `Inventory/UpdateItemType`;
    return this._http.post(url, request) as Observable<ItemTypeRequest>;
  }

  removeItemType(itemTypeId: number): Observable<boolean> {
    const url = `Inventory/RemoveItemType?itemTypeId=${itemTypeId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getItemTypeList(outletId: number) {
    const url = `Inventory/GetItemTypeList?outletId=${outletId}`;
    this._http
      .get<ItemTypeRequest[]>(url)
      .subscribe((data: ItemTypeRequest[]) => {
        this._itemTypeQuery.setLoading(false);
        if (data?.length > 0) {
          this._itemTypeQuery.addItemTypeList(data)
        } else {
          this._itemTypeQuery.addItemTypeList([]);
        }
        this._itemTypeQuery.selectLoading();
      });
  }


}
