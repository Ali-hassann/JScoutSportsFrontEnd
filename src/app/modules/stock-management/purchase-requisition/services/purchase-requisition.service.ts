import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InvoiceParameterRequest } from 'src/app/modules/inventory/invoice/models/invoice.model';
import { PaginationResponse } from 'src/app/shared/models/pagination.model';
import { PurchaseRequisitionDetailRequest, PurchaseRequisitionMasterRequest } from '../models/purchase-requisition.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequisitionService {

  constructor(
    private _http: HttpClient,
  ) { }

  addPurchaseRequisition(request: PurchaseRequisitionMasterRequest): Observable<PurchaseRequisitionMasterRequest> {
    const url = `PurchaseRequisitions/AddPurchaseRequisition`;
    return this._http.post(url, request) as Observable<PurchaseRequisitionMasterRequest>;
  }
  updatePurchaseRequisition(request: PurchaseRequisitionMasterRequest): Observable<PurchaseRequisitionMasterRequest> {
    const url = `PurchaseRequisitions/UpdatePurchaseRequisition`;
    return this._http.post(url, request) as Observable<PurchaseRequisitionMasterRequest>;
  }

  removePurchaseRequisition(masterId: number): Observable<boolean> {
    const url = `PurchaseRequisitions/RemovePurchaseRequisition?purchaseRequisitionMasterId=${masterId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getPurchaseRequisitionList(PurchaseRequisitionParameterRequest: InvoiceParameterRequest): Observable<PaginationResponse> {
    const url = `PurchaseRequisitions/GetPurchaseRequisitionListWithPagination`;
    return this._http.post<PaginationResponse>(url, PurchaseRequisitionParameterRequest) as Observable<PaginationResponse>;
  }

  postPurchaseRequisitions(PurchaseRequisitionMasterIds: number[]): Observable<any> {
    const url = `PurchaseRequisitions/PostMultipleRequisitions?status=1`;
    return this._http.post<any>(url, PurchaseRequisitionMasterIds) as Observable<any>;
  }

  getPurchaseRequisitionDetailById(PurchaseRequisitionMasterId: number): Observable<PurchaseRequisitionMasterRequest> {
    const url = `PurchaseRequisitions/GetPurchaseRequisitionById?purchaseRequisitionMasterId=${PurchaseRequisitionMasterId}`;
    return this._http.get<PurchaseRequisitionMasterRequest>(url) as Observable<PurchaseRequisitionMasterRequest>;
  }
  
  PurchaseRequisitionReport(PurchaseRequisitionMasterId: number): Observable<any> {
    const url = `Reports/PrintPurchaseRequisition?purchaseRequisitionMasterId=${PurchaseRequisitionMasterId}`;
    return this._http.get(url, { observe: "response", responseType: "blob" });
  }
}
