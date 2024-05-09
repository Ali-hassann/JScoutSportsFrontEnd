import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { Users } from '../../models/users.models';

export interface UserState
    extends EntityState<Users> { }

export function createInitialState(): UserState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.USERS,
    idKey: 'Id'
})

export class UserStore
    extends EntityStore<UserState> {
    constructor() {
        super();
    }
}