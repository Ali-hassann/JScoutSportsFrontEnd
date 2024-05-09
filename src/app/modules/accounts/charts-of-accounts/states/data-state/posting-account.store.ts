import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { PostingAccountsResponse } from '../../models/posting-accounts.model';

export interface PostingAccountsState extends EntityState<PostingAccountsResponse> { }

export function createInitialState(): PostingAccountsState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.POSTINGACCOUNTS,
    idKey: 'PostingAccountsId'
})

export class PostingAccountsStore extends EntityStore<PostingAccountsState> {
constructor(){
    super();
}
}