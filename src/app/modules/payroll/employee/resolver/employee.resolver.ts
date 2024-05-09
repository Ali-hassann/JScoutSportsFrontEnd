import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { EmployeeQuery } from '../states/employee.query';

@Injectable({
  providedIn: 'root'
})
export class EmployeeResolver implements Resolve<boolean> {
  constructor(
    private _EmployeeService: EmployeeService,
    private _EmployeeQuery: EmployeeQuery,) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (!this._EmployeeQuery.hasEntity()) {
      this._EmployeeService.getAllEmployees();
    } else {
      this._EmployeeQuery.reset();
      this._EmployeeService.getAllEmployees();
    }

    return of(true);
  }
}
