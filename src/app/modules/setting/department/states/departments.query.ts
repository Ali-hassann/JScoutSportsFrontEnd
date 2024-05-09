import { Injectable } from '@angular/core';
import { Order, QueryEntity, transaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { DepartmentsRequest } from '../models/department.model';
import { DepartmentsStore, DepartmentsState } from './departments.store';


@Injectable({ providedIn: "root" })
export class DepartmentQuery extends QueryEntity<DepartmentsState> {

    public departmentList$: Observable<DepartmentsRequest[]>;

    constructor(
        protected _departmentStore: DepartmentsStore,
    ) {
        super(_departmentStore);

        this.departmentList$ = this.selectAll(
            {
                sortBy: 'DepartmentsId',
                sortByOrder: Order.DESC
            }
        );
    }

    public reset(): void {
        this.store.remove();
    }

    public addDepartment(entity: DepartmentsRequest): void {
        this._departmentStore.add(entity);
    }

    @transaction()
    public setDepartmentList(entity: DepartmentsRequest[]): void {
        this._departmentStore.add(entity);
    }

    public setLoading(isLoading: boolean) {
        this._departmentStore.setLoading(isLoading);
    }

    public removeDepartmentById(id: number): void {
        this._departmentStore.remove(id);
    }

    public updateDepartment(entity: DepartmentsRequest): void {
        this._departmentStore.update(entity.DepartmentsId, entity);
    }


}