import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { ItemTypeRequest } from '../models/item-types.model';

export interface ItemTypeState
    extends EntityState<ItemTypeRequest> { }

export function createInitialState(): ItemTypeState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.ItemTYPE,
    idKey: 'ItemTypeId'
})

export class ItemTypeStore
    extends EntityStore<ItemTypeState> {
    constructor() {
        super();
    }

}