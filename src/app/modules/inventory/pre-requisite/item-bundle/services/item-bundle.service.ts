import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BundleQuery } from '../states/bundle.query';
import { BundleRequest } from '../components/models/item-bundle.model';
import { Observable } from 'rxjs';
import { ItemRequest } from '../../items/models/items.model';

@Injectable({
  providedIn: 'root'
})
export class ItemBundleService {
  constructor(
    private _http: HttpClient,
    private _bundleQuery: BundleQuery
  ) { }

  saveBundle(request: BundleRequest): Observable<BundleRequest> {
    const url = `Inventory/SaveBundle`;
    return this._http.post(url, request) as Observable<BundleRequest>;
  }

  removeBundle(bundleId: number): Observable<boolean> {
    const url = `Inventory/RemoveBundle?BundleId=${bundleId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }
  
  getBundleDetailById(bundleId: number): Observable<ItemRequest[]> {
    const url = `Inventory/GetBundleDetailById?bundleId=${bundleId}`;
    return this._http.get(url) as Observable<ItemRequest[]>;
  }

  getBundleList(outletId: number) {
    const url = `Inventory/GetBundleList?outletId=${outletId}`;
    this._http
      .get<BundleRequest[]>(url)
      .subscribe((data: BundleRequest[]) => {
        this._bundleQuery.setLoading(false);
        if (data?.length > 0) {
          this._bundleQuery.addBundleList(data)
        } else {
          this._bundleQuery.addBundleList([]);
        }
        this._bundleQuery.selectLoading();
      });
  }
}
