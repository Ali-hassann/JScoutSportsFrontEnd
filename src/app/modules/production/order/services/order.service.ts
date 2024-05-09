import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InvoiceParameterRequest } from 'src/app/modules/inventory/invoice/models/invoice.model';
import { PaginationResponse } from 'src/app/shared/models/pagination.model';
import { OrderDetailRequest, OrderMasterRequest } from '../models/order.model';
import { OrderQuery } from '../states/order.query';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private _http: HttpClient,
    private _orderQuery: OrderQuery,
  ) { }

  addOrder(request: OrderMasterRequest): Observable<OrderMasterRequest> {
    const url = `Production/AddOrder`;
    return this._http.post(url, request) as Observable<OrderMasterRequest>;
  }
  updateOrder(request: OrderMasterRequest): Observable<OrderMasterRequest> {
    const url = `Production/UpdateOrder`;
    return this._http.post(url, request) as Observable<OrderMasterRequest>;
  }

  removeOrder(masterId: number): Observable<boolean> {
    const url = `Production/RemoveOrder?orderMasterId=${masterId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }
  
  getOrderList(outletId: number) {
    const url = `Production/GetOrderList?outletId=${outletId}`;
    this._http
      .get<OrderMasterRequest[]>(url)
      .subscribe((data: OrderMasterRequest[]) => {
        this._orderQuery.setLoading(false);
        if (data?.length > 0) {
          this._orderQuery.addOrderList(data)
        } else {
          this._orderQuery.addOrderList([]);
        }
        this._orderQuery.selectLoading();
      });
  }

  postOrders(OrderMasterIds: number[]): Observable<any> {
    const url = `Production/PostMultipleOrders?status=1`;
    return this._http.post<any>(url, OrderMasterIds) as Observable<any>;
  }

  getOrderDetailById(OrderMasterId: number): Observable<OrderDetailRequest[]> {
    const url = `Production/GetOrderDetailById?orderMasterId=${OrderMasterId}`;
    return this._http.get<OrderDetailRequest[]>(url) as Observable<OrderDetailRequest[]>;
  }

  OrderReport(OrderMasterId: number): Observable<any> {
    const url = `Reports/PrintOrder?orderMasterId=${OrderMasterId}`;
    return this._http.get(url, { observe: "response", responseType: "blob" });
  }
}
