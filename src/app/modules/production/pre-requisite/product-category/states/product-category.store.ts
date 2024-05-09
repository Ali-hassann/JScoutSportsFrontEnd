import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { ProductCategoryRequest } from "../models/product-category.model";

export interface ProductCategoryState
    extends EntityState<ProductCategoryRequest> { }

export function createInitialState(): ProductCategoryState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.ITEMCATEGORY,
    idKey: 'ProductCategoryId'
})

export class ProductCategoryStore
    extends EntityStore<ProductCategoryState> {
        constructor() {
            super();
        }
}