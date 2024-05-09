import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeePayrollRequest } from '../../employee/models/employee.model';
import { EmployeeLoanRequest } from '../models/employee-loan.model';

@Injectable({
  providedIn: 'root'
})
export class EmloyeeLoanService {

  constructor(
    private _http: HttpClient
  ) { }

  // new apis
  getEmployeeLoanList(employeeId: number): Observable<EmployeeLoanRequest[]> {
    let url = `Payroll/GetEmployeeLoan?employeeId=${employeeId}`;
    return this._http.get<EmployeeLoanRequest[]>(url) as Observable<EmployeeLoanRequest[]>;
  }

  getApprovalLoanList(outletId: number): Observable<EmployeeLoanRequest[]> {
    let url = `Payroll/GetApprovalLoanList?outletId=${outletId}`;
    return this._http.get<EmployeeLoanRequest[]>(url) as Observable<EmployeeLoanRequest[]>;
  }

  removeEmployeeLoan(employeeLoanId: number) {
    return this._http.post<boolean>(`Payroll/RemoveEmployeeLoan?employeeLoanId=${employeeLoanId}`, null);
  }

  addEmployeeLoan(employeeLoanRequest: EmployeeLoanRequest): Observable<EmployeeLoanRequest> {
    return this._http.post(`Payroll/AddEmployeeLoan`, employeeLoanRequest) as Observable<EmployeeLoanRequest>;
  }

  updateEmployeeLoan(employeeLoanRequest: EmployeeLoanRequest): Observable<EmployeeLoanRequest> {
    return this._http.post(`Payroll/UpdateEmployeeLoan`, employeeLoanRequest) as Observable<EmployeeLoanRequest>;
  }

  employeeMultipleLoan(employeeLoanRequest: EmployeeLoanRequest[]): Observable<number> {
    return this._http.post(`Payroll/EmployeeMultipleLoan`, employeeLoanRequest) as Observable<number>;
  }
}
