import { Injectable } from "@angular/core";
import { Order, QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { ProductSizeState, ProductSizeStore } from "./product-size.store";
import { ProductSizeRequest } from "../models/product-size.model";

@Injectable({ providedIn: "root" })
export class ProductSizeQuery extends QueryEntity<ProductSizeState> {

    public productSizeList$: Observable<ProductSizeRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: ProductSizeStore,
        // protected _itemsQuery:ItemsQuery,
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.productSizeList$ = this.selectAll(
            {
                sortBy: 'ProductSizeId'
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

    public addProductSize(entity: ProductSizeRequest): void {
        this.store.add(entity);
    }
    public addProductSizeList(entity: ProductSizeRequest[]): void {
        this.store.add(entity);
    }

    public updateProductSize(entity: ProductSizeRequest): void {
        this.store.update(entity.ProductSizeId, entity);
    }

    public removeProductSizeById(ProductSizeId: number): void {
        this.store.remove(ProductSizeId);
    }

    public removeProductSizeStore(): void {
        this.store.remove();
    }

    public IsChildExist(id: number): boolean {
        // let find = this._itemsQuery.getAll()?.find(entity => entity.ProductSizeId === id);
        // return find ? true : false;
        return false;
    }
}