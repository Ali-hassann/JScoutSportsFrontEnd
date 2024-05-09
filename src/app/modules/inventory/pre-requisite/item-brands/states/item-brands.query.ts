import { Injectable } from "@angular/core";
import { Order, QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { ItemBrandsState, ItemBrandsStore } from "./item-brands.store";
import { BrandRequest } from "../models/item-brands.model";

@Injectable({ providedIn: "root" })
export class ItemBrandsQuery extends QueryEntity<ItemBrandsState> {

    public itemBrandList$: Observable<BrandRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: ItemBrandsStore
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.itemBrandList$ = this.selectAll(
            {
                sortBy: 'BrandId'
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

    public addItemBrand(entity: BrandRequest): void {
        this.store.add(entity);
    }
    public addItemBrandList(entity: BrandRequest[]): void {
        this.store.add(entity);
    }

    public updateItemBrand(entity: BrandRequest): void {
        this.store.update(entity.BrandId, entity);
    }

    public removeItemBrandById(BrandId: number): void {
        this.store.remove(BrandId);
    }

    public removeItemBrandtore(): void {
        this.store.remove();
    }
}