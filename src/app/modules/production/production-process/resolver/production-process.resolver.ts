import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { OrderQuery } from 'src/app/modules/production/order/states/order.query';
import { OrderService } from 'src/app/modules/production/order/services/order.service';
import { ProductQuery } from '../../pre-requisite/products/states/product.query';
import { ProductService } from '../../pre-requisite/products/services/product.service';
import { ItemsService } from 'src/app/modules/inventory/pre-requisite/items/services/items.service';
import { ItemsQuery } from 'src/app/modules/inventory/pre-requisite/items/states/items.query';
import { BundleQuery } from 'src/app/modules/inventory/pre-requisite/item-bundle/states/bundle.query';
import { ItemBundleService } from 'src/app/modules/inventory/pre-requisite/item-bundle/services/item-bundle.service';
import { EmployeeQuery } from 'src/app/modules/payroll/employee/states/employee.query';
import { EmployeeService } from 'src/app/modules/payroll/employee/services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionProcessResolver implements Resolve<boolean> {

  constructor(
    private _itemService: ItemsService,
    private _itemQuery: ItemsQuery,
    private _productService: ProductService,
    private _productQuery: ProductQuery,
    private _orderQuery: OrderQuery,
    private _orderService: OrderService,
    private _bundleQuery: BundleQuery,
    private _bundleService: ItemBundleService,
    private _employeeQuery: EmployeeQuery,
    private _employeeService: EmployeeService,
    private _authQuery: AuthQuery,) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this._itemQuery.hasEntity()) {
      this._itemService
        .getItemList(this._authQuery.PROFILE.CurrentOutletId);
    }

    if (!this._productQuery.hasEntity()) {
      this._productService
        .getProductList(this._authQuery.PROFILE.CurrentOutletId);

    }

    if (!this._orderQuery.hasEntity()) {
      this._orderService
        .getOrderList(this._authQuery.PROFILE.CurrentOutletId);
    }

    if (!this._employeeQuery.hasEntity()) {
      this._employeeService
      .getAllEmployees()
    }
    
    return of(true);
  }
}
