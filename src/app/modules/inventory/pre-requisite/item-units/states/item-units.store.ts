import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { UnitRequest } from "../models/item-units.model";

export interface UnitsState
    extends EntityState<UnitRequest> { }

export function createInitialState(): UnitsState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.UNITS,
    idKey: 'UnitId'
})

export class UnitsStore
    extends EntityStore<UnitsState> {
        constructor() {
            super();
        }
}