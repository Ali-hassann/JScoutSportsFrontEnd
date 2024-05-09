import { Injectable } from '@angular/core';
import { QueryEntity, transaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { Users as UsersRequest } from '../../models/users.models';
import { UserState, UserStore } from './user-store';

@Injectable({ providedIn: "root" })

export class UserQuery extends QueryEntity<UserState> {

    public users$: Observable<UsersRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _userStore: UserStore
    ) {
        super(_userStore);
        this.isDataLoading$ = this.selectLoading();
        this.users$ = this.selectAll();
    }

    @transaction()
    public addUsers(entity: UsersRequest[]): void {
        this._userStore.setLoading(false);
        this._userStore.add(entity);
    }

    public updateUser(entity: UsersRequest): void {
        this._userStore.update(entity.Id, entity);
    }

    public removeById(id: string): void {
        this._userStore.remove(id);
    }

    public reset(): void {
        this.store.remove();
    }

    public updateDataLoader(isToStopLoader: boolean): void {
        this._userStore.setLoading(isToStopLoader);
    }
}