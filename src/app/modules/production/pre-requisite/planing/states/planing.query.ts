import { Injectable } from "@angular/core";
import { Order, QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { PlaningMasterState, PlaningMasterStore } from "./planing.store";
import { PlaningMasterRequest } from "../components/models/planing.model";

@Injectable({ providedIn: "root" })
export class PlaningMasterQuery extends QueryEntity<PlaningMasterState> {

    public planingMasterList$: Observable<PlaningMasterRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: PlaningMasterStore
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.planingMasterList$ = this.selectAll(
            {
                sortBy: 'ProductId'
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

    public addPlaningMaster(entity: PlaningMasterRequest): void {
        this.store.add(entity);
    }
    public addPlaningMasterList(entity: PlaningMasterRequest[]): void {
        this.store.add(entity);
    }

    public updatePlaningMaster(entity: PlaningMasterRequest): void {
        this.store.update(entity.PlaningMasterId, entity);
    }

    public removePlaningMasterById(PlaningMasterId: number): void {
        this.store.remove(PlaningMasterId);
    }

    public removePlaningMasterStore(): void {
        this.store.remove();
    }

    public getAllPlaningMasters(): PlaningMasterRequest[] {
        return this.getAll(
            {
                sortBy: 'PlaningMasterId'
                , sortByOrder: Order.DESC
            }
        );
    }

    public getPlaningMastersById(itemId: number): PlaningMasterRequest | any {
        return this.getEntity(itemId);
    }

    public selectPlaningMasterByVendorId(vendorId: number): Observable<PlaningMasterRequest[]> {
        return this.selectAll({
            // filterBy: entity => entity.VendorIds.includes(vendorId.toString())
        });
    }

}