import { Injectable } from '@angular/core';
import { Order, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { PostingAccountsResponse } from '../../models/posting-accounts.model';
import { PostingAccountsState, PostingAccountsStore } from './posting-account.store';

@Injectable({ providedIn: "root" })
export class PostingAccountsQuery extends QueryEntity<PostingAccountsState> {

    public selectAllPostingAccountsList$: Observable<PostingAccountsResponse[]>;
    public getAllPostingAccountsList: PostingAccountsResponse[];
    public activePostingAccountsList$: Observable<PostingAccountsResponse[]>;

    constructor(
        protected _postingAccountsStore: PostingAccountsStore
    ) {
        super(_postingAccountsStore);
        this.selectAllPostingAccountsList$ = this.selectAll(
            {
                sortBy: 'PostingAccountsId',
                sortByOrder: Order.DESC
            }
        );

        this.getAllPostingAccountsList = this.getAll(
            {
                sortBy: 'PostingAccountsId',
                sortByOrder: Order.DESC
            }
        );
        this.activePostingAccountsList$ = this.selectAll(
            {
                sortBy: 'PostingAccountsId',
                sortByOrder: Order.DESC,
                filterBy: e => e.IsActive === true
            }
        );
    }

    public reset(): void {
        this.store.remove();
    }

    public addPostingAccount(entity: PostingAccountsResponse): void {
        this._postingAccountsStore.add(entity);
    }

    public addPostingAccountList(entity: PostingAccountsResponse[]): void {
        this._postingAccountsStore.setLoading(false);
        this._postingAccountsStore.add(entity);
    }

    public removePostingAccount(id: number): void {
        this._postingAccountsStore.remove(id);
    }

    public updatePostingAccount(entity: PostingAccountsResponse): void {
        this._postingAccountsStore.update(entity.PostingAccountsId, entity);
    }

    public getPostingAccountBySubCategoryId(subCategoryId: number): PostingAccountsResponse[] {
        return this.getAll().filter(x => x.SubCategoriesId === subCategoryId);
    }
}