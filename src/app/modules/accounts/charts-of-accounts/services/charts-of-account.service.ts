import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericBaseModel } from 'src/app/shared/models/base.model';

@Injectable({
  providedIn: 'root'
})
export class ChartsOfAccountService {

  constructor(
    private _http: HttpClient,
  ) { }

  public printChartOfAccounts(baseModel: GenericBaseModel): Observable<any> {
    let url = `Reports/PrintChartOfAccoutns?OrganizationId=${baseModel.OrganizationId}&OutletId=${baseModel.OutletId}&outletName=${baseModel.OutletName}&address=${baseModel.Address}`;
    return this._http.get(url, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
