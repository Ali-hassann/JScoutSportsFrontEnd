import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { DepartmentsRequest } from '../models/department.model';

export interface DepartmentsState extends EntityState<DepartmentsRequest> { }

export function createInitialState(): DepartmentsState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.EMPLOYEE_DEPARTMENT,
    idKey: 'DepartmentsId'
})

export class DepartmentsStore extends EntityStore<DepartmentsState> {
constructor(){
    super()
}
}