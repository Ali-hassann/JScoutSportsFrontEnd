import { Injectable } from '@angular/core';
import { Order, QueryEntity, transaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ItemTypeState, ItemTypeStore } from './item-types.store';
import { ItemTypeRequest } from '../models/item-types.model';
import { ItemCategoryQuery } from '../../item-category/states/item-category.query';

@Injectable({ providedIn: "root" })

export class ItemTypeQuery extends QueryEntity<ItemTypeState> {

    public itemTypeList$: Observable<ItemTypeRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: ItemTypeStore,
        protected _itemCategoryQuery: ItemCategoryQuery,
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.itemTypeList$ = this.selectAll(
            {
                sortBy: 'ItemTypeId'
                , sortByOrder: Order.DESC
            }
        );
    }

    public setLoading(loading: boolean): void {
        this.store.setLoading(loading);
    }

    public reset(): void {
        this.store.remove();
    }

    public addItemType(entity: ItemTypeRequest): void {
        this.store.add(entity);
    }
    public addItemTypeList(entity: ItemTypeRequest[]): void {
        this.store.add(entity);
    }

    public updateItemType(entity: ItemTypeRequest): void {
        this.store.update(entity.ItemTypeId, entity);
    }

    public removeItemTypeById(ItemItemTypeId: number): void {
        this.store.remove(ItemItemTypeId);
    }

    public removeItemTypesStore(): void {
        this.store.remove();
    }
    
    public IsChildExist(id: number): boolean {
        let find = this._itemCategoryQuery.getAll()?.find((entity: any) => entity.ItemItemTypeId === id);
        return find ? true : false;
    }
}