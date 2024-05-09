import { Injectable } from '@angular/core';
import { UnitRequest } from '../models/item-units.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UnitsQuery } from '../states/item-units.query';

@Injectable({
  providedIn: 'root'
})
export class ItemUnitsService {

  constructor(
    private _http: HttpClient,
    private _UnitsQuery: UnitsQuery
  ) { }

  addUnit(request: UnitRequest): Observable<UnitRequest> {
    const url = `Inventory/AddUnit`;
    return this._http.post(url, request) as Observable<UnitRequest>;
  }
  updateUnit(request: UnitRequest): Observable<UnitRequest> {
    const url = `Inventory/UpdateUnit`;
    return this._http.post(url, request) as Observable<UnitRequest>;
  }

  removeUnit(UnitId: number): Observable<boolean> {
    const url = `Inventory/RemoveUnit?UnitId=${UnitId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getUnitList(outletId: number) {
    const url = `Inventory/GetUnitList?outletId=${outletId}`;
    this._http
      .get<UnitRequest[]>(url)
      .subscribe((data: UnitRequest[]) => {
        this._UnitsQuery.setLoading(false);
        if (data?.length > 0) {
          this._UnitsQuery.addUnitList(data);
        } else {
          this._UnitsQuery.addUnitList([]);
        }
        this._UnitsQuery.selectLoading();
      });
  }
}
