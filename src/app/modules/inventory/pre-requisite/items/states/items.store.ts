import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { ItemRequest } from "../models/items.model";

export interface ItemsState
    extends EntityState<ItemRequest> { }

export function createInitialState(): ItemsState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.ITEMS,
    idKey: 'ItemId'
})

export class ItemsStore
    extends EntityStore<ItemsState> {
        constructor(){
            super()
        }
}