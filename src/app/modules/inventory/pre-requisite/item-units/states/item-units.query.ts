import { Injectable } from "@angular/core";
import { Order, QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { UnitsState, UnitsStore } from "./item-units.store";
import { UnitRequest } from "../models/item-units.model";

@Injectable({ providedIn: "root" })
export class UnitsQuery extends QueryEntity<UnitsState> {

    public unitsList$: Observable<UnitRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: UnitsStore,
        // protected _itemsQuery:ItemsQuery,
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.unitsList$ = this.selectAll(
            {
                sortBy: 'UnitId'
                , sortByOrder: Order.DESC
            }
        );
    }

    public reset(): void {
        this.store.remove();
    }

    public setLoading(loading: boolean): void {
        this.store.setLoading(loading);
    }

    public addUnit(entity: UnitRequest): void {
        this.store.add(entity);
    }
    public addUnitList(entity: UnitRequest[]): void {
        this.store.add(entity);
    }

    public updateUnit(entity: UnitRequest): void {
        this.store.update(entity.UnitId, entity);
    }

    public removeUnitById(UnitId: number): void {
        this.store.remove(UnitId);
    }

    public removeUnitStore(): void {
        this.store.remove();
    }

    public IsChildExist(id: number): boolean {
        // let find = this._itemsQuery.getAll()?.find(entity => entity.UnitId === id);
        // return find ? true : false;
        return false;
    }
}