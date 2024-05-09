import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { PayrollReportRequest } from '../../models/inventory-reports.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryReportService {

  constructor(
    private _authQuery: AuthQuery,
    private _http: HttpClient,
  ) {
  }

  itemReport() {
    let url = `Reports/PrintItems`;
    return this._http.get(url, { observe: "response", responseType: "blob" });
  }
}
