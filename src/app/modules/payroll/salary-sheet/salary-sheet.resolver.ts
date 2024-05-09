import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthQuery } from '../../common/auth/states/auth.query';
import { ConfigurationSettingQuery } from '../../accounts/accounts-configuration/states/data-states/accounts-configuration.query';
import { ConfigurationSettingService } from '../../accounts/accounts-configuration/services/configuration-setting.service';
import { PostingAccountsQuery } from '../../accounts/charts-of-accounts/states/data-state/posting-account.query';
import { PostingAccountsService } from '../../accounts/charts-of-accounts/services/posting-accounts.service';

@Injectable({
  providedIn: 'root'
})
export class SalarySheetResolver implements Resolve<boolean> {
  constructor(
    private _accountsConfiQuery: ConfigurationSettingQuery,
    private _postingAccountsQuery: PostingAccountsQuery,
    private _authQuery: AuthQuery,
    private _configurationService: ConfigurationSettingService,
    private _postingAccountService: PostingAccountsService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this._accountsConfiQuery.hasEntity()) {
      this._configurationService.getConfigurationSetting(this._authQuery.PROFILE.CurrentOutletId);
    }
    if (!this._postingAccountsQuery.hasEntity()) {
      this._postingAccountService.getPostingAccountList(this._authQuery.PROFILE.CurrentOutletId);
    }
    return of(true);
  }
}
