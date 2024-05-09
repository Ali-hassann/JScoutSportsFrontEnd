import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { UserProfile } from '../models/auth.model';

export interface AuthState extends EntityState<UserProfile> { }

export function createInitialState(): AuthState | any {
    return undefined;
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: 'Auth',
    idKey: 'UserName'
})

export class AuthStore extends EntityStore<AuthState> {

    constructor() {
        super(createInitialState());
    }
}