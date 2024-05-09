import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ItemVendorRequest } from '../models/item-vendor.model';

@Injectable({
  providedIn: 'root'
})
export class ItemVendorService {

  constructor(
    private _http: HttpClient
  ) { }

  saveItemVendor(request: ItemVendorRequest[]): Observable<boolean> {
    const url = `Inventory/SaveItemParticular`;
    return this._http.post(url, request) as Observable<boolean>;
  }

  removeItemVendor(itemId: number): Observable<boolean> {
    const url = `Inventory/DeleteItemParticularByItemId?itemId=${itemId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getItemVendorList(): Observable<ItemVendorRequest[]> {
    const url = `Inventory/GetItemParticularList`;
    return this._http.get<ItemVendorRequest[]>(url) as Observable<ItemVendorRequest[]>;
  }

  getItemVendorListByItemId(itemId: number): Observable<ItemVendorRequest[]> {
    const url = `Inventory/GetItemParticularByItemId?itemId=${itemId}`;
    return this._http.get<ItemVendorRequest[]>(url) as Observable<ItemVendorRequest[]>;
  }
}
