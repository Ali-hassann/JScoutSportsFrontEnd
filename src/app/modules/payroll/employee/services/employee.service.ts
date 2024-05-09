import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { EmployeeBasicRequest, EmployeeRequest } from '../models/employee.model';
import { EmployeeQuery } from '../states/employee.query';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private _authQuery: AuthQuery,
    private _http: HttpClient,
    private _employeeQuery: EmployeeQuery
  ) {
  }
  getAllEmployees(): void {
    this._employeeQuery.setLoading(true);
    this._http.get<EmployeeBasicRequest[]>(`Employee/GetEmployeeList?organizationId=${this._authQuery.PROFILE.OrganizationId}&outletId=${this._authQuery.PROFILE.OutletId}&employeeStatus=-1`).subscribe(
      (data: EmployeeBasicRequest[]) => {
        if (data) {
          this._employeeQuery.setEmployeeList(data);
        }
        this._employeeQuery.setLoading(false);
      }
    );
  }

  updateEmployee(employee: EmployeeRequest) {
    return this._http.post<EmployeeBasicRequest>(`Employee/UpdateEmployee`, employee);
  }

  addEmployee(employee: EmployeeRequest) {
    return this._http.post<EmployeeBasicRequest>(`Employee/AddEmployee`, employee);
  }

  deleteEmployee(employeeId: number): Observable<boolean> {

    return this._http.post<boolean>(

      `Employee/RemoveEmployee?employeeId=${employeeId}`, {}

    ) as Observable<boolean>;
  }

  markEmployeeActiveInActive(
    ids: number[],
    status: boolean
  ): Observable<number[]> {
    return this._http.post(
      `Employee/MultipleActiveInactiveEmployee?status=${status}`,
      ids
    ) as Observable<number[]>;
  }

  getEmployeeById(employeId: number) {
    return this._http.get<EmployeeRequest>(`Employee/GetEmployeeById?employeeId=${employeId}`)
  }

  // createEmployeeCard(employeeCardRequest: EmployeeCardRequest): Observable<any> {
  //   return this._http.post<any>(`Reports/CreateEmployeeCard`, employeeCardRequest) as Observable<any>;
  // }

  // generateEmployeesPayroll(employeesPayroll: GenerateEmployeesPayroll): Observable<boolean> {
  //   return this._http.post<boolean>(`Payroll/GenerateEmployeesPayroll`, employeesPayroll) as Observable<boolean>;
  // }
}
