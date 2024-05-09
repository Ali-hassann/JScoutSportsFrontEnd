import { Injectable } from '@angular/core';
import { ParticularRequest } from '../models/item-particular.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParticularQuery } from '../states/item-paticular.query';

@Injectable({
  providedIn: 'root'
})
export class ParticularService {

  constructor(
    private _http: HttpClient,
    private _ParticularQuery: ParticularQuery
  ) { }

  addParticular(request: ParticularRequest): Observable<ParticularRequest> {
    const url = `Inventory/AddParticular`;
    return this._http.post(url, request) as Observable<ParticularRequest>;
  }
  updateParticular(request: ParticularRequest): Observable<ParticularRequest> {
    const url = `Inventory/UpdateParticular`;
    return this._http.post(url, request) as Observable<ParticularRequest>;
  }

  removeParticular(particularId: number): Observable<boolean> {
    const url = `Inventory/RemoveParticular?particularId=${particularId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getParticularList(outletId: number) {
    const url = `Inventory/GetParticularList?outletId=${outletId}`;
    this._http
      .get<ParticularRequest[]>(url)
      .subscribe((data: ParticularRequest[]) => {
        this._ParticularQuery.setLoading(false);
        if (data?.length > 0) {
          this._ParticularQuery.addParticularList(data);
        } else {
          this._ParticularQuery.addParticularList([]);
        }
        this._ParticularQuery.selectLoading();
      });
  }
}
