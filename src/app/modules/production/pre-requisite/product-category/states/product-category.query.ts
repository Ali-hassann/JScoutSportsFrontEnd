import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { ProductCategoryState, ProductCategoryStore } from "./product-category.store";
import { ProductCategoryRequest } from "../models/product-category.model";


@Injectable({ providedIn: "root" })
export class ProductCategoryQuery extends QueryEntity<ProductCategoryState> {

    public productCategoryList$: Observable<ProductCategoryRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: ProductCategoryStore,
        // protected _productQuery: ProductsQuery
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.productCategoryList$ = this.selectAll();
    }

    public reset(): void {
        this.store.remove();
    }

    public setLoading(loading: boolean): void {
        this.store.setLoading(loading);
    }

    public addProductCategory(entity: ProductCategoryRequest): void {
        this.store.add(entity);
    }
    public addProductCategoryList(entity: ProductCategoryRequest[]): void {
        this.store.add(entity);
    }

    public updateProductCategory(entity: ProductCategoryRequest): void {
        this.store.update(entity.ProductCategoryId, entity);
    }

    public removeProductCategoryById(CategoryId: number): void {
        this.store.remove(CategoryId);
    }

    public removeProductCategorytore(): void {
        this.store.remove();
    }

    public IsChildExist(id: number): boolean {
        // let find = this._productQuery.getAll()?.find(entity => entity.CategoryId === id);
        // return find ? true : false;
        return false;
    }
}