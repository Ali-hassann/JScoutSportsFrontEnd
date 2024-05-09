import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeAllowancesRequest} from '../models/employee-allowance.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAllowanceService {

  constructor(
    private _http: HttpClient
  ) { }

  getAllowanceList(employeeId: number): Observable<EmployeeAllowancesRequest[]> {
    return this._http.get<EmployeeAllowancesRequest[]>(`Payroll/GetEmployeeAllowanceList?employeeId=${employeeId}`);
  }

  addAllowance(benifits: EmployeeAllowancesRequest): Observable<EmployeeAllowancesRequest> {
    return this._http.post<EmployeeAllowancesRequest>(`Payroll/AddAllowance`, benifits) as Observable<EmployeeAllowancesRequest>;
  }

  updateAllowance(benifits: EmployeeAllowancesRequest): Observable<EmployeeAllowancesRequest> {
    return this._http.post<EmployeeAllowancesRequest>(`Payroll/UpdateAllowance`, benifits) as Observable<EmployeeAllowancesRequest>;
  }
  
  removeAllowance(request: EmployeeAllowancesRequest): Observable<boolean> {
    const url = `Payroll/RemoveAllowance`;
    return this._http.post(url, request) as Observable<boolean>;
  }
}
