import { Injectable } from '@angular/core';
import { ItemRequest } from '../models/items.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ItemsQuery } from '../states/items.query';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {


  constructor(
    private _http: HttpClient,
    private _itemsQuery: ItemsQuery
  ) { }

  addItem(request: ItemRequest): Observable<ItemRequest> {
    const url = `Inventory/AddItem`;
    return this._http.post(url, request) as Observable<ItemRequest>;
  }
  updateItem(request: ItemRequest): Observable<ItemRequest> {
    const url = `Inventory/UpdateItem`;
    return this._http.post(url, request) as Observable<ItemRequest>;
  }

  removeItem(itemId: number): Observable<boolean> {
    const url = `Inventory/RemoveItem?itemId=${itemId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getItemList(outletId: number) {
    const url = `Inventory/GetItemList?outletId=${outletId}`;
    this._http
      .get<ItemRequest[]>(url)
      .subscribe((data: ItemRequest[]) => {
        this._itemsQuery.setLoading(false);
        if (data?.length > 0) {
          this._itemsQuery.addItemList(data);
        } else {
          this._itemsQuery.addItemList([]);
        }
        this._itemsQuery.selectLoading();
      });
  }

  itemReport() {
    let url = `Reports/PrintItems`;
    return this._http.get(url, { observe: "response", responseType: "blob" });
  }
}
