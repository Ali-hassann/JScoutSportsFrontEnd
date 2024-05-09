import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationResponse } from 'src/app/shared/models/pagination.model';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { VoucherListRequest, VoucherMasterList, VouchersMasterRequest } from '../models/voucher.model';
import { VoucherQuery } from '../states/data-state/voucher-query';
import { UiVoucherQuery } from '../states/ui-state/ui-voucher.query';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  constructor(
    private _http: HttpClient
    , private _voucherQuery: VoucherQuery
    , private _uiVoucherQuery: UiVoucherQuery
    , private _hotToastService: HotToastService
    // , private _messageService: MessageService
  ) { }

  public addVoucher(request: VouchersMasterRequest): Observable<VoucherMasterList> {
    let url = "Vouchers/AddVoucher";
    return this._http.post<VoucherMasterList>(url, request) as Observable<VoucherMasterList>;
  }

  public updateVoucher(request: VouchersMasterRequest): Observable<VoucherMasterList> {
    let url = "Vouchers/UpdateVoucher";
    return this._http.post<VoucherMasterList>(url, request) as Observable<VoucherMasterList>;
  }

  public removeVoucher(voucherMasterId: number): Observable<boolean> {
    let url = `Vouchers/RemoveVoucher?voucherMasterId=${voucherMasterId}`;
    return this._http.post<boolean>(url, null) as Observable<boolean>;
  }

  public getVouchersById(voucherMasterId: number): Observable<VouchersMasterRequest> {
    let url = `Vouchers/GetVouchersById?voucherId=${voucherMasterId}`;
    return this._http.get(url) as Observable<VouchersMasterRequest>;
  }

  public getVouchersListWithPagination(request: VoucherListRequest): void {
    // Data_Store Working
    let tost = this._hotToastService.loading("Please wait voucher list is being fetched");
    this._voucherQuery.removeVouchers();
    let url = "Vouchers/GetVouchersListWithPagination";

    this._http
      .post<PaginationResponse>(url, request)
      .pipe
      (
        tap(vouchersListResponse => {

          if (vouchersListResponse?.Data?.length > 0) {
            this._voucherQuery.addVoucher(vouchersListResponse.Data);

            //

            tost.close();
            this._hotToastService.success('Vouch list fetched successfully');
            // UI_Store_Working
            let uiVoucherListPagination = new PaginationResponse();
            CommonHelperService.mapSourceObjToDestination(this._uiVoucherQuery.getUiVoucher(), uiVoucherListPagination);
            CommonHelperService.mapSourceObjToDestination(vouchersListResponse, uiVoucherListPagination);

            this._uiVoucherQuery.updateUiVoucher(uiVoucherListPagination);
            //
          }
          else {
            this._hotToastService.info("No record found for selected criteria");
            // this._messageService.add({ severity: 'info', summary: 'Info', detail: 'No record found for selected criteria', life: 3000 });
            tost.close();
          }

          this._voucherQuery.updateDataLoader(false);
          //
        })
      ).subscribe();
  }

  public postMultipleVouchers(voucherMasterIds: number[], status: number): Observable<boolean> {
    let url = `Vouchers/PostMultipleVouchers?voucherStatus=${status}`;
    return this._http.post<boolean>(url, voucherMasterIds) as Observable<boolean>;
  }

  public printDailyVoucherReport(voucherListRequest: VoucherListRequest): Observable<any> {
    let url = `Reports/PrintDailyVouchers`;
    return this._http.post(url, voucherListRequest, { observe: "response", responseType: "blob" }) as Observable<any>;
  }


  public printVoucher(voucherMasterId: number, isAdvanceVoucher: boolean = false): Observable<any> {
    let url = `Reports/PrintVoucher?vouchersMasterId=${voucherMasterId}&isAdvanceVoucher=${isAdvanceVoucher}`;
    return this._http.get(url, { observe: "response", responseType: "blob" }) as Observable<any>;
  }
}
