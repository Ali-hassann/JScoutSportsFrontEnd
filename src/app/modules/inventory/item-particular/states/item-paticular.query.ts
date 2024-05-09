import { Injectable } from "@angular/core";
import { Order, QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { ParticularState, ParticularStore, } from "./item-paticular.store";
import { ParticularRequest } from "../models/item-particular.model";
import { ParticularType } from "src/app/shared/enums/particular-type.enum";

@Injectable({ providedIn: "root" })
export class ParticularQuery extends QueryEntity<ParticularState> {

    public VendorList$: Observable<ParticularRequest[]>;
    public CustomerList$: Observable<ParticularRequest[]>;
    public OthersList$: Observable<ParticularRequest[]>;
    public isDataLoading$: Observable<boolean>;

    constructor(
        protected _store: ParticularStore,
    ) {
        super(_store);
        this.isDataLoading$ = this.selectLoading();
        this.VendorList$ = this.selectAll(
            {
                sortBy: 'ParticularId'
                , sortByOrder: Order.DESC
                , filterBy: (x) => x.ParticularType === ParticularType.VENDOR
            }
        );
        this.CustomerList$ = this.selectAll(
            {
                sortBy: 'ParticularId'
                , sortByOrder: Order.DESC
                , filterBy: (x) => x.ParticularType === ParticularType.CUSTOMER
            }
        );
        this.OthersList$ = this.selectAll(
            {
                sortBy: 'ParticularId'
                , sortByOrder: Order.DESC
                , filterBy: (x) => x.ParticularType === ParticularType.OTHERS
            }
        );
    }

    public reset(): void {
        this.store.remove();
    }

    public setLoading(loading: boolean): void {
        this.store.setLoading(loading);
    }

    public addParticular(entity: ParticularRequest): void {
        this.store.add(entity);
    }
    public addParticularList(entity: ParticularRequest[]): void {
        this.store.add(entity);
    }

    public updateParticular(entity: ParticularRequest): void {
        this.store.update(entity.ParticularId, entity);
    }

    public removeParticularById(ParticularId: number): void {
        this.store.remove(ParticularId);
    }

    public removeParticulartore(): void {
        this.store.remove();
    }
}