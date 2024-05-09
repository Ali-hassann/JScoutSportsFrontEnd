import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlaningMasterQuery } from '../states/planing.query';
import { PlaningMasterRequest } from '../components/models/planing.model';
import { Observable } from 'rxjs';
import { ItemRequest } from 'src/app/modules/inventory/pre-requisite/items/models/items.model';
import { ProductionFilterRequest } from '../../process/models/process.model';

@Injectable({
  providedIn: 'root'
})
export class PlaningService {
  constructor(
    private _http: HttpClient,
    private _planingMasterQuery: PlaningMasterQuery
  ) { }

  savePlaningMaster(request: PlaningMasterRequest[]): Observable<PlaningMasterRequest> {
    const url = `Production/SavePlaningMaster`;
    return this._http.post(url, request) as Observable<PlaningMasterRequest>;
  }

  removePlaningMaster(planingMasterId: number): Observable<boolean> {
    const url = `Production/RemovePlaningMaster?PlaningMasterId=${planingMasterId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getPlaningDetailById(request: ProductionFilterRequest): Observable<ItemRequest[]> {
    const url = `Production/GetPlaningDetailById`;
    return this._http.post(url, request) as Observable<ItemRequest[]>;
  }

  getPlaningMasterList(outletId: number) {
    const url = `Production/GetPlaningMasterList?outletId=${outletId}`;
    this._http
      .get<PlaningMasterRequest[]>(url)
      .subscribe((data: PlaningMasterRequest[]) => {
        this._planingMasterQuery.setLoading(false);
        if (data?.length > 0) {
          this._planingMasterQuery.removePlaningMasterStore();
          this._planingMasterQuery.addPlaningMasterList(data);
        } else {
          this._planingMasterQuery.addPlaningMasterList([]);
        }
        this._planingMasterQuery.selectLoading();
      });
  }
}
