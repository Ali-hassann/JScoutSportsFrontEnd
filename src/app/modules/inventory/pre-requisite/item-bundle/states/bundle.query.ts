import { Injectable } from "@angular/core";
import { Order, QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { BundleState, BundleStore } from "./bundle.store";
import { BundleRequest } from "../components/models/item-bundle.model";

@Injectable({ providedIn: "root" })
export class BundleQuery extends QueryEntity<BundleState> {

    public bundleList$: Observable<BundleRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: BundleStore
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.bundleList$ = this.selectAll(
            {
                sortBy: 'BundleId'
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

    public addBundle(entity: BundleRequest): void {
        this.store.add(entity);
    }
    public addBundleList(entity: BundleRequest[]): void {
        this.store.add(entity);
    }

    public updateBundle(entity: BundleRequest): void {
        this.store.update(entity.BundleId, entity);
    }

    public removeBundleById(BundleId: number): void {
        this.store.remove(BundleId);
    }

    public removeBundleStore(): void {
        this.store.remove();
    }

    public getAllBundles(): BundleRequest[] {
        return this.getAll(
            {
                sortBy: 'BundleId'
                , sortByOrder: Order.DESC
            }
        );
    }

    public getBundlesById(itemId: number): BundleRequest | any {
        return this.getEntity(itemId);
    }

    public selectBundleByVendorId(vendorId: number): Observable<BundleRequest[]> {
        return this.selectAll({
            // filterBy: entity => entity.VendorIds.includes(vendorId.toString())
        });
    }

}