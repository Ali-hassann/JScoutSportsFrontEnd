import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProcessTypeQuery } from '../states/process-type.query';
import { ProcessTypeRequest } from '../models/process-type.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessTypeService {

  constructor(
    private _http: HttpClient,
    private _processTypeQuery: ProcessTypeQuery
  ) { }

  addProcessType(request: ProcessTypeRequest): Observable<ProcessTypeRequest> {
    const url = `Production/AddProcessType`;
    return this._http.post(url, request) as Observable<ProcessTypeRequest>;
  }
  updateProcessType(request: ProcessTypeRequest): Observable<ProcessTypeRequest> {
    const url = `Production/UpdateProcessType`;
    return this._http.post(url, request) as Observable<ProcessTypeRequest>;
  }

  removeProcessType(processTypeId: number): Observable<boolean> {
    const url = `Production/RemoveProcessType?processTypeId=${processTypeId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getProcessTypeList() {
    const url = `Production/GetProcessTypeList`;
    this._http
      .get<ProcessTypeRequest[]>(url)
      .subscribe((data: ProcessTypeRequest[]) => {
        this._processTypeQuery.setLoading(false);
        if (data?.length > 0) {
          this._processTypeQuery.removeProcessTypetore();
          this._processTypeQuery.addProcessTypeList(data)
        } else {
          this._processTypeQuery.addProcessTypeList([]);
        }
        this._processTypeQuery.selectLoading();
      });
  }
}
