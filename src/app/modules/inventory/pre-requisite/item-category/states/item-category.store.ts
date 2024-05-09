import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { ItemCategoryRequest } from "../models/item-category.model";

export interface ItemCategoryState
    extends EntityState<ItemCategoryRequest> { }

export function createInitialState(): ItemCategoryState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.ITEMCATEGORY,
    idKey: 'ItemCategoryId'
})

export class ItemCategoryStore
    extends EntityStore<ItemCategoryState> {
        constructor() {
            super();
        }
}