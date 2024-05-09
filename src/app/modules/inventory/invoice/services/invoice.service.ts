import { Injectable } from '@angular/core';
import { InvoiceDetailRequest, InvoiceListResponse, InvoiceMasterRequest, InvoiceParameterRequest } from '../models/invoice.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(
    private _http: HttpClient,
  ) { }

  addInvoice(request: InvoiceMasterRequest): Observable<InvoiceMasterRequest> {
    const url = `Invoices/AddInvoice`;
    return this._http.post(url, request) as Observable<InvoiceMasterRequest>;
  }
  updateInvoice(request: InvoiceMasterRequest): Observable<InvoiceMasterRequest> {
    const url = `Invoices/UpdateInvoice`;
    return this._http.post(url, request) as Observable<InvoiceMasterRequest>;
  }

  removeInvoice(masterId: number): Observable<boolean> {
    const url = `Invoices/RemoveInvoice?invoiceMasterId=${masterId}`;
    return this._http.post(url, null) as Observable<boolean>;
  }

  getInvoiceList(invoiceParameterRequest: InvoiceParameterRequest): Observable<InvoiceListResponse> {
    const url = `Invoices/GetInvoiceListWithPagination`;
    return this._http.post<InvoiceListResponse>(url, invoiceParameterRequest) as Observable<InvoiceListResponse>;
  }
  postInvoices(invoiceMasterIds: InvoiceMasterRequest): Observable<boolean> {
    const url = `Invoices/PostInvoice`;
    return this._http.post<boolean>(url, invoiceMasterIds) as Observable<boolean>;
  }
  getInvoiceDetailListByInvoiceMasterId(invoiceMasterId: number): Observable<InvoiceDetailRequest[]> {
    const url = `Invoices/GetInvoiceDetailById?invoiceMasterId=${invoiceMasterId}`;
    return this._http.get<InvoiceDetailRequest[]>(url) as Observable<InvoiceDetailRequest[]>;
  }
  invoiceReport(invoiceMasterId: number): Observable<any> {
    const url = `Reports/PrintInvoice?invoiceMasterId=${invoiceMasterId}`;
    return this._http.get(url, { observe: "response", responseType: "blob" });
  }
  // getInvoiceList(invoiceParameterRequest: InvoiceParameterRequest) {
  //   const url = `Invoices/GetInvoiceListWithPagination`;
  //   this._http
  //     .post<InvoiceMasterRequest[]>(url,invoiceParameterRequest)
  //     .subscribe((data: InvoiceMasterRequest[]) => {
  //       this._invoiceQuery.setLoading(false);
  //       if (data?.length > 0) {
  //         this._invoiceQuery.addInvoiceList(data)
  //       } else {
  //         this._invoiceQuery.addInvoiceList([]);
  //       }
  //       this._invoiceQuery.selectLoading();
  //     });
  // }
}
