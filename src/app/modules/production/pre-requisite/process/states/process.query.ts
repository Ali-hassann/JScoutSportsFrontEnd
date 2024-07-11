import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { ProcessState, ProcessStore } from "./process.store";
import { ProcessRequest } from "../models/process.model";


@Injectable({ providedIn: "root" })
export class ProcessQuery extends QueryEntity<ProcessState> {

    public processList$: Observable<ProcessRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: ProcessStore,
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.processList$ = this.selectAll();
    }

    public reset(): void {
        this.store.remove();
    }

    public setLoading(loading: boolean): void {
        this.store.setLoading(loading);
    }

    public addProcess(entity: ProcessRequest): void {
        this.store.add(entity);
    }
    public addProcessList(entity: ProcessRequest[]): void {
        this.store.add(entity);
    }

    public updateProcess(entity: ProcessRequest): void {
        this.store.update(entity.ProcessId, entity);
    }

    public removeProcessById(CategoryId: number): void {
        this.store.remove(CategoryId);
    }

    public removeProcesStore(): void {
        this.store.remove();
    }

    public selectProcessListByOrderId(orderMasterId: number, mainProcessTypeId: number): Observable<ProcessRequest[]> {
        return this.selectAll({
            filterBy: process => process.OrderMasterId === orderMasterId && process.MainProcessTypeId === mainProcessTypeId
        });
    }

    public selectProcessListWithMainTypeId(mainTypeId: number, productId: number): Observable<ProcessRequest[]> {
        return this.selectAll({
            filterBy: process => process.MainProcessTypeId === mainTypeId && process.ProductId === productId
        });
    }

    public IsChildExist(id: number): boolean {
        // let find = this._productQuery.getAll()?.find(entity => entity.CategoryId === id);
        // return find ? true : false;
        return false;
    }
}