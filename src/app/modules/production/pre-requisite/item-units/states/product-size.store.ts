import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { ProductSizeRequest } from "../models/product-size.model";

export interface ProductSizeState
    extends EntityState<ProductSizeRequest> { }

export function createInitialState(): ProductSizeState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.UNITS,
    idKey: 'ProductSizeId'
})

export class ProductSizeStore
    extends EntityStore<ProductSizeState> {
        constructor() {
            super();
        }
}