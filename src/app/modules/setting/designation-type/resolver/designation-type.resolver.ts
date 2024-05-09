import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DesignationTypeService } from '../services/designation-type.service';

@Injectable({
  providedIn: 'root'
})
export class DesignationTypeResolver implements Resolve<boolean> {
  constructor(
    private _designationTypeService: DesignationTypeService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this._designationTypeService.getDesignationTypeList();
    return of(true);
  }
}
