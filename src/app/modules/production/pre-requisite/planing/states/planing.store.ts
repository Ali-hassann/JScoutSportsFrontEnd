import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { PlaningMasterRequest } from "../components/models/planing.model";

export interface PlaningMasterState
    extends EntityState<PlaningMasterRequest> { }

export function createInitialState(): PlaningMasterState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.BUNDLE,
    idKey: 'ProductId'
})

export class PlaningMasterStore
    extends EntityStore<PlaningMasterState> {
        constructor(){
            super()
        }
}