import { Injectable } from "@angular/core";
import { Order, QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { OrderState, OrderStore } from "./order.store";
import { OrderMasterRequest } from "../models/order.model";

@Injectable({ providedIn: "root" })
export class OrderQuery extends QueryEntity<OrderState> {

    public orderList$: Observable<OrderMasterRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: OrderStore
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.orderList$ = this.selectAll(
            {
                sortBy: 'OrderMasterId'
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

    public addOrder(entity: OrderMasterRequest): void {
        this.store.add(entity);
    }
    public addOrderList(entity: OrderMasterRequest[]): void {
        this.store.add(entity);
    }

    public updateOrder(entity: OrderMasterRequest): void {
        this.store.update(entity.OrderMasterId, entity);
    }

    public removeOrderById(OrderId: number): void {
        this.store.remove(OrderId);
    }

    public removeOrderStore(): void {
        this.store.remove();
    }

    public getAllOrders(): OrderMasterRequest[] {
        return this.getAll(
            {
                sortBy: 'OrderMasterId'
                , sortByOrder: Order.DESC
            }
        );
    }

    public checkOrderDuplication(orderName: string): boolean {
        return this.getAll().findIndex(c => c.OrderName?.toLowerCase() === orderName?.toLowerCase()) > 0;
    }

    public getOrdersById(orderId: number): OrderMasterRequest | any {
        return this.getEntity(orderId);
    }

    public selectOrderByVendorId(vendorId: number): Observable<OrderMasterRequest[]> {
        return this.selectAll({
            // filterBy: entity => entity.VendorIds.includes(vendorId.toString())
        });
    }

}