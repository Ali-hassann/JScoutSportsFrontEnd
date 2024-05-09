import { Injectable } from "@angular/core";
import { Order, QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { ProductRequest } from "../models/product.model";
import { ProductState, ProductStore } from "./product.store";

@Injectable({ providedIn: "root" })
export class ProductQuery extends QueryEntity<ProductState> {

    public productList$: Observable<ProductRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: ProductStore
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.productList$ = this.selectAll(
            {
                sortBy: 'ProductId'
                , sortByOrder: Order.DESC
            }
        );
    }

    public reset(): void {
        this.store.remove();
    }

    public setLoading(loading: boolean): void {
        this.store.setLoading(loading);
    }

    public addProduct(entity: ProductRequest): void {
        this.store.add(entity);
    }
    public addProductList(entity: ProductRequest[]): void {
        this.store.add(entity);
    }

    public updateProduct(entity: ProductRequest): void {
        this.store.update(entity.ProductId, entity);
    }

    public removeProductById(ProductId: number): void {
        this.store.remove(ProductId);
    }

    public removeProductStore(): void {
        this.store.remove();
    }

    public getAllProducts(): ProductRequest[] {
        return this.getAll(
            {
                sortBy: 'ProductId'
                , sortByOrder: Order.DESC
            }
        );
    }

    public checkProductDuplication(productName: string): boolean {
        return this.getAll().findIndex(c => c.ProductName?.toLowerCase() === productName?.toLowerCase()) > 0;
    }

    public getProductsById(productId: number): ProductRequest | any {
        return this.getEntity(productId);
    }

    public selectProductByVendorId(vendorId: number): Observable<ProductRequest[]> {
        return this.selectAll({
            // filterBy: entity => entity.VendorIds.includes(vendorId.toString())
        });
    }

}