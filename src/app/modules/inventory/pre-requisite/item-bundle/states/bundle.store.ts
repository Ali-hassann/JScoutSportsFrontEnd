import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { BundleRequest } from "../components/models/item-bundle.model";

export interface BundleState
    extends EntityState<BundleRequest> { }

export function createInitialState(): BundleState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.BUNDLE,
    idKey: 'BundleId'
})

export class BundleStore
    extends EntityStore<BundleState> {
        constructor(){
            super()
        }
}