import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { ProcessTypeRequest } from "../models/process-type.model";

export interface ProcessTypeState
    extends EntityState<ProcessTypeRequest> { }

export function createInitialState(): ProcessTypeState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.ITEMCATEGORY,
    idKey: 'ProcessTypeId'
})

export class ProcessTypeStore
    extends EntityStore<ProcessTypeState> {
        constructor() {
            super();
        }
}