import { Injectable } from '@angular/core';
import { Order, QueryEntity, transaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { DesignationRequestResponse } from '../models/benefit-type.model';
import { DesignationTypeState, DesignationTypeStore } from './designation-type.store';


@Injectable({ providedIn: "root" })
export class DesignationTypeQuery extends QueryEntity<DesignationTypeState> {

    public designationTypeList$: Observable<DesignationRequestResponse[]>;

    constructor(
        protected _designationTypeStore: DesignationTypeStore,
    ) {
        super(_designationTypeStore);

        this.designationTypeList$ = this.selectAll(
            {
                sortBy: 'DesignationId',
                sortByOrder: Order.DESC
            }
        );
    }

    public reset(): void {
        this.store.remove();
    }

    public addDesignationType(entity: DesignationRequestResponse): void {
        this._designationTypeStore.add(entity);
    }

    @transaction()
    public setDesignationTypeList(entity: DesignationRequestResponse[]): void {
        this._designationTypeStore.add(entity);
    }

    public setLoading(isLoading: boolean) {
        this._designationTypeStore.setLoading(isLoading);
    }

    public removeDesignationTypeById(id: number): void {
        this._designationTypeStore.remove(id);
    }

    public updateDesignationType(entity: DesignationRequestResponse): void {
        this._designationTypeStore.update(entity.DesignationId, entity);
    }


}