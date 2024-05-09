import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { HeadCategorysResponse } from '../../models/head-category.model';

export interface HeadCategoryState extends EntityState<HeadCategorysResponse> { }

export function createInitialState(): HeadCategoryState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.HEADCATEGORY,
    idKey: 'HeadCategoriesId'
})

export class HeadCategoryStore extends EntityStore<HeadCategoryState> {
constructor(){
    super()
}
}