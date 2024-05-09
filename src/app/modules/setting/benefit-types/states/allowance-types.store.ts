import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { AllowanceTypeRequest } from '../models/allowance-type.model';

export interface BenefitTypeState extends EntityState<AllowanceTypeRequest> { }

export function createInitialState(): BenefitTypeState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.ALLOWANCE_TYPE,
    idKey: 'AllowanceTypeId'
})

export class BenefitTypeStore extends EntityStore<BenefitTypeState> {
constructor(){
    super()
}
}