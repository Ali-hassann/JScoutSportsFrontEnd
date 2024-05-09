import { Injectable } from '@angular/core';
import { Order, QueryEntity, transaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VOUCHER_STATUS } from 'src/app/shared/enums/voucher.enum';
import { VoucherMasterList } from '../../models/voucher.model';
import { VoucherState, VoucherStore } from './voucher-store';

@Injectable({ providedIn: "root" })

export class VoucherQuery extends QueryEntity<VoucherState> {

    public voucherListResponse$: Observable<VoucherMasterList[]>;
    public isDataLoading$: Observable<boolean>;
    public isAnySelected$: Observable<boolean>;

    constructor(
        protected _voucherStore: VoucherStore
    ) {

        super(_voucherStore);
        this.isDataLoading$ = this.selectLoading();
        this.voucherListResponse$ = this.selectAll(
            {
                sortBy: 'VouchersMasterId'
                , sortByOrder: Order.DESC
            }
        );

        this.isAnySelected$ = this.selectCount(x => x.Selected).pipe(map(count => count > 0));
    }


    public reset(): void {
        this.store.remove();
    }
    public addVoucher(entity: VoucherMasterList): void {
        this._voucherStore.add(entity);
    }

    public updateVoucher(entity: VoucherMasterList): void {
        this._voucherStore.update(entity.VouchersMasterId, entity);
    }

    public removeVoucherById(voucherMasterId: number): void {
        this._voucherStore.remove(voucherMasterId);
    }

    public getSelectedVouchersForPostingAdmin(): number[] {
        return this.getAll()
            ?.filter(c => c.Selected && c.VoucherStatus === +VOUCHER_STATUS.UnPosted)
            ?.map(c => c.VouchersMasterId)
            ?? [];
    }

    public removeVouchers(): void {
        this._voucherStore.remove();
    }

    @transaction()
    public postMultipleVouchers(voucherIds: number[], status: number): void {
        if (voucherIds?.length > 0) {
            this._voucherStore.update(voucherIds, { VoucherStatus: status, VoucherStatusName: (status === 2 ? VOUCHER_STATUS.Posted.toString() : VOUCHER_STATUS.UnPosted.toString()) });
        }
    }

    public updateDataLoader(isToStopLoader: boolean): void {
        this._voucherStore.setLoading(isToStopLoader);
    }

    @transaction()
    public selectAllVouchers(): void {
        this._voucherStore.update(null, { Selected: true });
    }

    @transaction()
    public unSelectAllVouchers(): void {
        this._voucherStore.update(null, { Selected: false });
    }

    public unSelectSingleVouchers(voucherMasterId: number): void {
        this._voucherStore.update(voucherMasterId, { Selected: false });
    }

    public selectSingleVouchers(voucherMasterId: number): void {
        this._voucherStore.update(voucherMasterId, { Selected: true });
    }
}