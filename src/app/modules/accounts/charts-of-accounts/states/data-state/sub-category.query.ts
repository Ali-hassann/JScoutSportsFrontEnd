import { Injectable } from '@angular/core';
import { Order, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { SubCategoriesResponse } from '../../models/sub-category.model';
import { PostingAccountsQuery } from './posting-account.query';
import { SubCategoryState, SubCategoryStore } from './sub-category.store';

@Injectable({ providedIn: "root" })
export class SubCategoryQuery extends QueryEntity<SubCategoryState> {

    public subCategoryList$: Observable<SubCategoriesResponse[]>;


    constructor(
        protected _SubCategoryStore: SubCategoryStore,
        protected _postingAccountsQuery: PostingAccountsQuery,
    ) {
        super(_SubCategoryStore);

        this.subCategoryList$ = this.selectAll(
            {
                sortBy: 'SubCategoriesId',
                sortByOrder: Order.DESC
            }
        );
    }

    public reset():void{
        this.store.remove();
    }
    
    public addSubCategory(entity: SubCategoriesResponse): void {
        this._SubCategoryStore.add(entity);
    }

    public addSubCategoryList(entity: SubCategoriesResponse[]): void {
        this._SubCategoryStore.add(entity);
    }

    public removeSubCategory(id: number): void {
        this._SubCategoryStore.remove(id);
    }

    public updateSubCategory(entity: SubCategoriesResponse): void {
        this._SubCategoryStore.update(entity.SubCategoriesId, entity);
    }

    public getSubCategoriesByHeadCategoryId(headCategoryId: Number): SubCategoriesResponse[] {
        return this.getAll().filter(entity => entity.HeadCategoriesId === headCategoryId);
    }

    public IsChildExist(id: number): boolean {
        let find = this._postingAccountsQuery.getAll()?.find(entity => entity.SubCategoriesId === id);
        return find ? true : false;
    }
}