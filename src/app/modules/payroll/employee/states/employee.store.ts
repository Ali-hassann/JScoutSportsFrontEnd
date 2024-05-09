import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { EmployeeBasicRequest } from '../models/employee.model';

export interface EmployeeState extends EntityState<EmployeeBasicRequest> { }

export function createInitialState(): EmployeeState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.EMPLOYEE,
    idKey: 'EmployeeId'
})

export class EmployeeStore extends EntityStore<EmployeeState> {
constructor(){
    super()
}
}