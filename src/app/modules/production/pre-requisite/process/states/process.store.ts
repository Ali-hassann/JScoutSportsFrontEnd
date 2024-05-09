import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { ProcessRequest } from "../models/process.model";

export interface ProcessState
    extends EntityState<ProcessRequest> { }

export function createInitialState(): ProcessState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.ITEMCATEGORY,
    idKey: 'ProcessId'
})

export class ProcessStore
    extends EntityStore<ProcessState> {
        constructor() {
            super();
        }
}