import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { ProductRequest } from "../models/product.model";

export interface ProductState
    extends EntityState<ProductRequest> { }

export function createInitialState(): ProductState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.ITEMS,
    idKey: 'ProductId'
})

export class ProductStore
    extends EntityStore<ProductState> {
        constructor(){
            super()
        }
}