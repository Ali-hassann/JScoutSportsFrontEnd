import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { UI_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { PaginationBase } from "src/app/shared/models/base.model";

export interface UiVoucherState extends EntityState {
    uiVoucherListPagination: PaginationBase;
    uiUnpostedVoucher: number;
}

const initialState = {
    uiVoucherListPagination: new PaginationBase(),
    uiUnpostedVoucher:0
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: UI_STORE_NAME.UI_VOUCHER })

export class UiVoucherStore extends EntityStore<UiVoucherState> {
    constructor() {
        super(initialState);
    }
}