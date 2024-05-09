import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { ItemCategoryRequest } from "../models/item-category.model";
import { ItemCategoryState, ItemCategoryStore } from "./item-category.store";


@Injectable({ providedIn: "root" })
export class ItemCategoryQuery extends QueryEntity<ItemCategoryState> {

    public itemCategoryList$: Observable<ItemCategoryRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: ItemCategoryStore,
        // protected _itemQuery: ItemsQuery
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.itemCategoryList$ = this.selectAll();
    }

    public reset(): void {
        this.store.remove();
    }

    public setLoading(loading: boolean): void {
        this.store.setLoading(loading);
    }

    public addItemCategory(entity: ItemCategoryRequest): void {
        this.store.add(entity);
    }
    public addItemCategoryList(entity: ItemCategoryRequest[]): void {
        this.store.add(entity);
    }

    public updateItemCategory(entity: ItemCategoryRequest): void {
        this.store.update(entity.ItemCategoryId, entity);
    }

    public removeItemCategoryById(CategoryId: number): void {
        this.store.remove(CategoryId);
    }

    public removeItemCategorytore(): void {
        this.store.remove();
    }

    public IsChildExist(id: number): boolean {
        // let find = this._itemQuery.getAll()?.find(entity => entity.CategoryId === id);
        // return find ? true : false;
        return false;
    }
}