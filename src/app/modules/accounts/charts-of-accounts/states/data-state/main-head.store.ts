import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { MainHeadsResponse } from '../../models/main-head.model';

export interface MainHeadState extends EntityState<MainHeadsResponse> { }

export function createInitialState(): MainHeadState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.MAINHEAD,
    idKey: 'MainHeadsId'
})

export class MainHeadStore extends EntityStore<MainHeadState> {
constructor(){
    super();
}
}