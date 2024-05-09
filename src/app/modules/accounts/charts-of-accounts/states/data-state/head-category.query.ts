import { Injectable } from '@angular/core';
import { Order, QueryEntity, transaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { HeadCategoriesRequest, HeadCategorysResponse as HeadCategoriesResponse } from '../../models/head-category.model';
import { HeadCategoryState, HeadCategoryStore } from './head-category.store';
import { SubCategoryQuery } from './sub-category.query';


@Injectable({ providedIn: "root" })
export class HeadCategoryQuery extends QueryEntity<HeadCategoryState> {

    public headCategoryList$: Observable<HeadCategoriesResponse[]>;

    constructor(
        protected _headCategoryStore: HeadCategoryStore,
        protected _subCategoryQuery: SubCategoryQuery
    ) {
        super(_headCategoryStore);

        this.headCategoryList$ = this.selectAll(
            {
                sortBy: 'HeadCategoriesId',
                sortByOrder: Order.DESC
            }
        );
    }

    public reset():void{
        this.store.remove();
    }
    
    public addHeadCategory(entity: HeadCategoriesRequest): void {
        this._headCategoryStore.add(entity);
    }

    @transaction()
    public addHeadCategoryList(entity: HeadCategoriesRequest[]): void {
        this._headCategoryStore.setLoading(false);
        this._headCategoryStore.add(entity);
    }

    public removeHeadCategory(id: number): void {
        this._headCategoryStore.remove(id);
    }

    public updateHeadCategory(entity: HeadCategoriesRequest): void {
        this._headCategoryStore.update(entity.HeadCategoriesId, entity);
    }
    public getHeadCategoriesByMainHeadId(mainHeadId: Number): HeadCategoriesResponse[] {
        let headCategories = this.getAll()?.filter(entity => entity.MainHeadsId === mainHeadId);
        return headCategories?.length > 0 ? headCategories : [];
    }

    public IsChildExist(id: number): boolean {
        let find = this._subCategoryQuery.getAll()?.find(entity => entity.HeadCategoriesId === id);
        return find ? true : false;
    }
}