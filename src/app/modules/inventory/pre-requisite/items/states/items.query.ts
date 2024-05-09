import { Injectable } from "@angular/core";
import { Order, QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { ItemRequest } from "../models/items.model";
import { ItemsState, ItemsStore } from "./items.store";

@Injectable({ providedIn: "root" })
export class ItemsQuery extends QueryEntity<ItemsState> {

    public itemsList$: Observable<ItemRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: ItemsStore
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.itemsList$ = this.selectAll(
            {
                sortBy: 'ItemId'
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

    public addItem(entity: ItemRequest): void {
        this.store.add(entity);
    }
    public addItemList(entity: ItemRequest[]): void {
        this.store.add(entity);
    }

    public updateItem(entity: ItemRequest): void {
        this.store.update(entity.ItemId, entity);
    }

    public removeItemById(ItemId: number): void {
        this.store.remove(ItemId);
    }

    public removeItemStore(): void {
        this.store.remove();
    }

    public getAllItems(): ItemRequest[] {
        return this.getAll(
            {
                sortBy: 'ItemId'
                , sortByOrder: Order.DESC
            }
        );
    }

    public checkItemDuplication(itemName: string): boolean {
        return this.getAll().findIndex(c => c.ItemName?.toLowerCase() === itemName?.toLowerCase()) > 0;
    }

    public getItemsById(itemId: number): ItemRequest | any {
        return this.getEntity(itemId);
    }

    public selectItemByVendorId(vendorId: number): Observable<ItemRequest[]> {
        return this.selectAll({
            // filterBy: entity => entity.VendorIds.includes(vendorId.toString())
        });
    }

}