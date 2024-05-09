import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { OrderMasterRequest } from "../models/order.model";

export interface OrderState
    extends EntityState<OrderMasterRequest> { }

export function createInitialState(): OrderState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.ITEMS,
    idKey: 'OrderMasterId'
})

export class OrderStore
    extends EntityStore<OrderState> {
        constructor(){
            super()
        }
}