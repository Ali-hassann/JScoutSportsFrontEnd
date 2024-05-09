import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { SubCategoriesResponse } from '../../models/sub-category.model';

export interface SubCategoryState extends EntityState<SubCategoriesResponse> { }

export function createInitialState(): SubCategoryState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.SUBCATEGORY,
    idKey: 'SubCategoriesId'
})

export class SubCategoryStore extends EntityStore<SubCategoryState> {
constructor(){
    super();
}
}