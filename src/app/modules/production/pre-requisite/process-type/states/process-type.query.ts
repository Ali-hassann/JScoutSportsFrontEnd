import { Injectable } from "@angular/core";
import { Order, QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { ProcessTypeState, ProcessTypeStore } from "./process-type.store";
import { ProcessTypeRequest } from "../models/process-type.model";


@Injectable({ providedIn: "root" })
export class ProcessTypeQuery extends QueryEntity<ProcessTypeState> {

    public processTypeList$: Observable<ProcessTypeRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: ProcessTypeStore,
    ) {

        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.processTypeList$ = this.selectAll({ sortBy: 'SortOrder', sortByOrder: Order.ASC });
    }

    public reset(): void {
        this.store.remove();
    }

    public setLoading(loading: boolean): void {
        this.store.setLoading(loading);
    }

    public addProcessType(entity: ProcessTypeRequest): void {
        this.store.add(entity);
    }
    public addProcessTypeList(entity: ProcessTypeRequest[]): void {
        this.store.add(entity);
    }

    public updateProcessType(entity: ProcessTypeRequest): void {
        this.store.update(entity.ProcessTypeId, entity);
    }

    public removeProcessTypeById(CategoryId: number): void {
        this.store.remove(CategoryId);
    }

    public removeProcessTypetore(): void {
        this.store.remove();
    }

    public IsChildExist(id: number): boolean {
        // let find = this._productQuery.getAll()?.find(entity => entity.CategoryId === id);
        // return find ? true : false;
        return false;
    }
}