import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { ParticularRequest } from "../models/item-particular.model";

export interface ParticularState
    extends EntityState<ParticularRequest> { }

export function createInitialState(): ParticularState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.PARTICULAR,
    idKey: 'ParticularId'
})

export class ParticularStore
    extends EntityStore<ParticularState> {
        constructor() {
            super();
        }
}