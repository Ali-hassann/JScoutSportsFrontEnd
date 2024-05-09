import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AllowanceTypeService as AllowanceTypeService } from '../services/allowance-type.service';

@Injectable({
  providedIn: 'root'
})
export class AllowanceTypeResolver implements Resolve<boolean> {

  constructor(private _allowanceTypeService: AllowanceTypeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this._allowanceTypeService.getAllowanceTypeList();
    return of(true);
  }
}
