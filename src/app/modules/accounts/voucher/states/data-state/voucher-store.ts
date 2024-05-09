import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { VoucherMasterList } from '../../models/voucher.model';

export interface VoucherState
    extends EntityState<VoucherMasterList> { }

export function createInitialState(): VoucherState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.VOUCHER,
    idKey: 'VouchersMasterId'
})

export class VoucherStore
    extends EntityStore<VoucherState> {
}