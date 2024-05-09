
import { Injectable } from "@angular/core";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { BrandRequest } from "../models/item-brands.model";

export interface ItemBrandsState
    extends EntityState<BrandRequest> { }

export function createInitialState(): ItemBrandsState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.BRANDS,
    idKey: 'BrandId'
})

export class ItemBrandsStore
    extends EntityStore<ItemBrandsState> {
        constructor() {
            super();
        }
}