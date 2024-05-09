import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DepartmentService } from '../services/department.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentResolver implements Resolve<boolean> {

  constructor(private _departmentService: DepartmentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this._departmentService.getDepartmentList();
    return of(true);
  }
}
