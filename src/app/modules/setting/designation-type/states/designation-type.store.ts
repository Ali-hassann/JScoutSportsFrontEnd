import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { DesignationRequestResponse } from '../models/benefit-type.model';

export interface DesignationTypeState extends EntityState<DesignationRequestResponse> { }

export function createInitialState(): DesignationTypeState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.DESIGNATION_TYPE,
    idKey: 'DesignationId'
})

export class DesignationTypeStore extends EntityStore<DesignationTypeState> {
constructor(){
    super()
}
}