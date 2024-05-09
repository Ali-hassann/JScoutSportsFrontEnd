import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { Observable, of } from "rxjs";
import { ConfigurationSettingService } from "src/app/modules/accounts/accounts-configuration/services/configuration-setting.service";
import { AccountsConfigurationQuery } from "src/app/modules/accounts/accounts-configuration/states/data-states/accounts-configuration.query";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { CoaReferesherService } from "src/app/modules/accounts/charts-of-accounts/services/coa-referesher.service";
import { UsersService } from "src/app/modules/common/users/services/users.service";


@Injectable({ providedIn: "root" })
export class DashboardResolver implements Resolve<Observable<boolean>> {

  public OrganizationId: number;
  public OutletId: number;

  constructor(
    private _authQuery: AuthQuery
    , private _accountsConfigurationService: ConfigurationSettingService
    , private _accountsConfigurationQuery: AccountsConfigurationQuery
    , public _coaReferesher: CoaReferesherService
    , private _userDataService: UsersService
  ) {

    this.OrganizationId = this._authQuery?.OrganizationId;
    this.OutletId = this._authQuery?.OutletId;
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    // Getting Accounts Configuration if not Exists
    if (!this._accountsConfigurationQuery.hasEntity()) {
      this._accountsConfigurationService.getAccountsConfiguration(this.OrganizationId, this.OutletId);
    }
    this._coaReferesher.getChartOfAccountDataList();
    //

    // Getting Users List
    this._userDataService.getUsersList();
    //

    return of(true);
  }
}
