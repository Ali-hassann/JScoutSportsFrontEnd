import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ItemsService } from '../../pre-requisite/items/services/items.service';
import { ItemsQuery } from '../../pre-requisite/items/states/items.query';
import { OrderQuery } from 'src/app/modules/production/order/states/order.query';
import { OrderService } from 'src/app/modules/production/order/services/order.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceResolver implements Resolve<boolean> {

  constructor(
    private _itemService: ItemsService,
    private _itemQuery: ItemsQuery,
    private _orderQuery: OrderQuery,
    private _orderService: OrderService,
    private _authQuery: AuthQuery,) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this._itemQuery.itemsList$.subscribe(res => {
      res?.length == 0 ? this._itemService
        .getItemList(this._authQuery.PROFILE.CurrentOutletId) : res;
    });
    this._orderQuery.orderList$.subscribe(res => {
      res?.length == 0 ? this._orderService
        .getOrderList(this._authQuery.PROFILE.CurrentOutletId) : res;
    });
    return of(true);
  }
}
