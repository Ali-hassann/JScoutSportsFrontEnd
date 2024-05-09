import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ProductService } from '../products/services/product.service';
import { ParticularService } from 'src/app/modules/inventory/item-particular/services/item-particular.service';
import { ItemUnitsService } from 'src/app/modules/inventory/pre-requisite/item-units/services/item-units.service';
import { ProductCategoryService } from '../product-category/services/product-category.service';
import { OrderService } from '../../order/services/order.service';
import { ProcessTypeService } from '../process-type/services/process-type.service';
import { ProcessService } from '../process/services/process.service';
import { ItemsService } from 'src/app/modules/inventory/pre-requisite/items/services/items.service';
import { PlaningService } from '../planing/services/planing.service';
import { ProductSizeService } from '../item-units/services/product-size.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionPreRequisteResolver implements Resolve<boolean> {
  constructor(
    private _authQuery: AuthQuery,
    private _productCategoryService: ProductCategoryService,
    private _itemUnitsService: ItemUnitsService,
    private _productService: ProductService,
    private _itemService: ItemsService,
    private _particularService: ParticularService,
    private _orderService: OrderService,
    private _processTypeService: ProcessTypeService,
    private _processService: ProcessService,
    private _planingService: PlaningService,
    private _productSizeService: ProductSizeService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this._productCategoryService.getProductCategoryList(this._authQuery.PROFILE.OutletId);
    this._itemUnitsService.getUnitList(this._authQuery.PROFILE.OutletId);
    this._productService.getProductList(this._authQuery.PROFILE.OutletId);
    this._itemService.getItemList(this._authQuery.PROFILE.OutletId);
    this._particularService.getParticularList(this._authQuery.PROFILE.OutletId);
    this._orderService.getOrderList(this._authQuery.PROFILE.OutletId);
    this._processTypeService.getProcessTypeList();
    this._processService.getProcessListForStore();
    this._planingService.getPlaningMasterList(this._authQuery.PROFILE.OutletId);
    this._productSizeService.getProductSizeList();
    return of(true);
  }
}
