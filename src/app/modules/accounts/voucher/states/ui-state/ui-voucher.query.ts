import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { Observable, of } from "rxjs";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { PaginationBase } from "src/app/shared/models/base.model";
import { UiVoucherState, UiVoucherStore } from "./ui-voucher.store";

@Injectable({ providedIn: 'root' })
export class UiVoucherQuery extends QueryEntity<UiVoucherState> {

    uiVoucherListPagination$: Observable<PaginationBase>;
    uiUnpostedVoucher$: Observable<number>;

    constructor(
        protected _uiVoucherStore: UiVoucherStore
        , private _authQuery: AuthQuery
    ) {
        super(_uiVoucherStore);
        this.uiVoucherListPagination$ = this.select(state => state.uiVoucherListPagination);
        this.uiUnpostedVoucher$=this.select(state => state.uiUnpostedVoucher);
        this.initialStoreValues();
    }

    public addUiVoucher(uiVoucherState: PaginationBase): void {
        this.store.add(uiVoucherState);
    }

    public updateUiVoucher(uiVoucherState: PaginationBase): void {
        this.store.update({ uiVoucherListPagination: uiVoucherState });
    }

    public reset(): void {
        this.store.remove();
    }

    public getUiVoucher(): PaginationBase {
        return this.getValue().uiVoucherListPagination;
    }


    public setUnpostedVoucherCount(count: number): void {
        this.store.update({ uiUnpostedVoucher: count });
    }

    public initialStoreValues(): void {
        let uiVoucher = new PaginationBase();
        uiVoucher.OrganizationId = this._authQuery.OrganizationId ?? 0;
        uiVoucher.OutletId = this._authQuery.OutletId ?? 0;
        uiVoucher.PageNumber = 1;
        uiVoucher.RecordsPerPage = 10;

        this.updateUiVoucher(uiVoucher);
    }
}