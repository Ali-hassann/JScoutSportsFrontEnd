import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PurchaseOrderDetailRequest, PurchaseOrderMasterRequest } from '../models/purchase-order.model';
import { InvoiceParameterRequest } from 'src/app/modules/inventory/invoice/models/invoice.model';
import { PaginationResponse } from 'src/app/shared/models/pagination.model';
import { PurchaseRequisitionDetailRequest } from '../../purchase-requisition/models/purchase-requisition.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(
    private _http: HttpClient,
  ) { }

  addPurchaseOrder(request: PurchaseOrderMasterRequest): Observable<PurchaseOrderMasterRequest> {
    const url = `PurchaseOrders/AddPurchaseOrder`;
    return this._http.post(url, request) as Observable<PurchaseOrderMasterRequest>;
  }
  updatePurchaseOrder(request: PurchaseOrderMasterRequest): Observable<PurchaseOrderMasterRequest> {
    const url = `PurchaseOrders/UpdatePurchaseOrder`;
    return this._http.post(url, request) as Observable<PurchaseOrderMasterRequest>;
  }

  removePurchaseOrder(masterId: number): Observable<boolean> {
    const url = `PurchaseOrders/RemovePurchaseOrder?purchaseOrderMasterId=${masterId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getPurchaseOrderList(PurchaseOrderParameterRequest: InvoiceParameterRequest): Observable<PaginationResponse> {
    const url = `PurchaseOrders/GetPurchaseOrderList`;
    return this._http.post<PaginationResponse>(url, PurchaseOrderParameterRequest) as Observable<PaginationResponse>;
  }

  postPurchaseOrders(PurchaseOrderMasterIds: number[]): Observable<any> {
    const url = `PurchaseOrders/PostMultipleOrders?status=1`;
    return this._http.post<any>(url, PurchaseOrderMasterIds) as Observable<any>;
  }

  getPurchaseOrderDetailById(PurchaseOrderMasterId: number): Observable<PurchaseOrderDetailRequest[]> {
    const url = `PurchaseOrders/GetPurchaseOrderById?purchaseOrderMasterId=${PurchaseOrderMasterId}`;
    return this._http.get<PurchaseOrderDetailRequest[]>(url) as Observable<PurchaseOrderDetailRequest[]>;
  }

  PurchaseOrderReport(PurchaseOrderMasterId: number): Observable<any> {
    const url = `Reports/PrintPurchaseOrder?purchaseOrderMasterId=${PurchaseOrderMasterId}`;
    return this._http.get(url, { observe: "response", responseType: "blob" });
  }

  // for geting details of puchase requisition
  getRequisitionDetailByIds(reqIds: number[]): Observable<PurchaseRequisitionDetailRequest[]> {
    const url = `PurchaseRequisitions/GetRequisitionDetailByIds`;
    return this._http.post<PurchaseRequisitionDetailRequest[]>(url, reqIds) as Observable<PurchaseRequisitionDetailRequest[]>;
  }
}
