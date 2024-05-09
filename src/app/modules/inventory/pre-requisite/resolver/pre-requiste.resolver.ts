import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ItemTypesService } from '../item-types/services/item-types.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ItemCategoryService } from '../item-category/services/item-category.service';
import { ItemBrandsService } from '../item-brands/services/item-brands.service';
import { ItemUnitsService } from '../item-units/services/item-units.service';
import { ItemsService } from '../items/services/items.service';
import { ParticularService } from '../../item-particular/services/item-particular.service';
import { ItemBundleService } from '../item-bundle/services/item-bundle.service';
import { ItemTypeQuery } from '../item-types/states/item-types.query';
import { ItemCategoryQuery } from '../item-category/states/item-category.query';
import { UnitsQuery } from '../item-units/states/item-units.query';
import { ItemsQuery } from '../items/states/items.query';
import { ParticularQuery } from '../../item-particular/states/item-paticular.query';

@Injectable({
  providedIn: 'root'
})
export class PreRequisteResolver implements Resolve<boolean> {
  constructor(
    private _itemTypesService: ItemTypesService,
    private _itemTypesQuery: ItemTypeQuery,
    private _authQuery: AuthQuery,
    private _itemCategoryService: ItemCategoryService,
    private _itemCategoryQuery: ItemCategoryQuery,
    private _itemUnitsService: ItemUnitsService,
    private _itemUnitsQuery: UnitsQuery,
    private _itemsService: ItemsService,
    private _itemsQuery: ItemsQuery,
    private _particularService: ParticularService,
    private _particularQuery: ParticularQuery,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this._itemTypesQuery.hasEntity()) {
      this._itemTypesService.getItemTypeList(this._authQuery.PROFILE.OutletId);
    }
    if (!this._itemCategoryQuery.hasEntity()) {
      this._itemCategoryService.getItemCategoryList(this._authQuery.PROFILE.OutletId);
    }
    if (!this._itemUnitsQuery.hasEntity()) {
      this._itemUnitsService.getUnitList(this._authQuery.PROFILE.OutletId);
    }
    if (!this._itemsQuery.hasEntity()) {
      this._itemsService.getItemList(this._authQuery.PROFILE.OutletId);
    }
    if (!this._particularQuery.hasEntity()) {
      this._particularService.getParticularList(this._authQuery.PROFILE.OutletId);
    }

    return of(true);
  }
}
