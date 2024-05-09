import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProcessQuery } from '../states/process.query';
import { ProcessRequest, ProductionFilterRequest } from '../models/process.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  constructor(
    private _http: HttpClient,
    private _processQuery: ProcessQuery
  ) { }

  saveProcess(request: ProcessRequest[]): Observable<boolean> {
    const url = `Production/SaveProcess`;
    return this._http.post(url, request) as Observable<boolean>;
  }

  transferProcess(fromProductId: number, toProductIds: number[]): Observable<boolean> {
    const url = `Production/TransferProcess?fromProductId=${fromProductId}`;
    return this._http.post(url, toProductIds) as Observable<boolean>;
  }

  removeProcess(processId: number): Observable<boolean> {
    const url = `Production/RemoveProcess?processId=${processId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getProcessListByProduct(request: ProductionFilterRequest) {
    const url = `Production/GetProcessListByProduct`;
    return this._http
      .post<ProcessRequest[]>(url, request);
  }

  getProcessListForStore() {
    const url = `Production/GetProcessListForStore`;
    this._http
      .get<ProcessRequest[]>(url)
      .subscribe((data: ProcessRequest[]) => {
        this._processQuery.setLoading(false);
        if (data?.length > 0) {
          this._processQuery.removeProcesstore();
          this._processQuery.addProcessList(data)
        } else {
          this._processQuery.addProcessList([]);
        }
        this._processQuery.selectLoading();
      });
  }

  getProcessList() {
    const url = `Production/GetProcessList`;
    return this._http.get<ProcessRequest[]>(url)
  }
}
