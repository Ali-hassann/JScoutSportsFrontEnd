import { Injectable } from '@angular/core';
import { Order, QueryEntity, transaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { EmployeeBasicRequest } from '../models/employee.model';
import { EmployeeState, EmployeeStore } from './employee.store';
import { SalaryTypeEnum } from 'src/app/shared/enums/SalaryType';


@Injectable({ providedIn: "root" })
export class EmployeeQuery extends QueryEntity<EmployeeState> {

    public employeeList$: Observable<EmployeeBasicRequest[]>;

    constructor(
        protected _employeeStore: EmployeeStore,
    ) {
        super(_employeeStore);

        this.employeeList$ = this.selectAll(
            {
                sortBy: 'EmployeeId',
                sortByOrder: Order.DESC
            }
        );
    }

    public reset(): void {
        this.store.remove();
    }

    public addEmployee(entity: EmployeeBasicRequest): void {
        this._employeeStore.add(entity);
    }

    @transaction()
    public setEmployeeList(entity: EmployeeBasicRequest[]): void {
        this._employeeStore.add(entity);
    }

    public setLoading(isLoading: boolean) {
        this._employeeStore.setLoading(isLoading);
    }

    public removeEmployeeById(id: number): void {
        this._employeeStore.remove(id);
    }

    public updateEmployee(entity: EmployeeBasicRequest): void {
        this._employeeStore.update(entity.EmployeeId, entity);
    }

    public getEmployeeOfSelectedDepartment(departmentsIds: number[], salaryType: number): Observable<EmployeeBasicRequest[]> {

        return this.selectAll
            ({
                filterBy: x => (departmentsIds.length == 0 || departmentsIds.includes(x.DepartmentsId)) && x.SalaryType === salaryType,
            });
    }

    public selectAllContractor(): Observable<EmployeeBasicRequest[]> {
        return this.selectAll
            ({
                filterBy: x => x.SalaryType == SalaryTypeEnum.Wages,
            });
    }

    public selectAllEmployees(): Observable<EmployeeBasicRequest[]> {
        return this.selectAll
            ({
                filterBy: x => x.SalaryType !== SalaryTypeEnum.Wages,
            });
    }
}