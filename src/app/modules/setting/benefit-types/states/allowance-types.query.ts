import { Injectable } from '@angular/core';
import { Order, QueryEntity, transaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { AllowanceTypeRequest } from '../models/allowance-type.model';
import { BenefitTypeState as AllowanceTypeState, BenefitTypeStore } from './allowance-types.store';


@Injectable({ providedIn: "root" })
export class AllowanceTypeQuery extends QueryEntity<AllowanceTypeState> {

    public allowanceTypeList$: Observable<AllowanceTypeRequest[]>;

    constructor(
        protected _allowanceTypeStore: BenefitTypeStore,
    ) {
        super(_allowanceTypeStore);

        this.allowanceTypeList$ = this.selectAll(
            {
                sortBy: 'AllowanceTypeId',
                sortByOrder: Order.DESC
            }
        );
    }

    public reset(): void {
        this.store.remove();
    }

    public addAllowanceType(entity: AllowanceTypeRequest): void {
        this.store.add(entity);
    }

    @transaction()
    public setAllowanceTypeList(entity: AllowanceTypeRequest[]): void {
        this.store.add(entity);
    }

    public setLoading(isLoading: boolean) {
        this.store.setLoading(isLoading);
    }

    public removeAllowanceTypeById(id: number): void {
        this.store.remove(id);
    }

    public updateAllowanceType(entity: AllowanceTypeRequest): void {
        this.store.update(entity.AllowanceTypeId, entity);
    }
}