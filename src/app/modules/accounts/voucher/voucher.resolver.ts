import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfigurationSettingQuery } from '../accounts-configuration/states/data-states/accounts-configuration.query';
import { ConfigurationSettingService } from '../accounts-configuration/services/configuration-setting.service';
import { AuthQuery } from '../../common/auth/states/auth.query';

@Injectable({
  providedIn: 'root'
})
export class VoucherResolver implements Resolve<boolean> {
  constructor(
    private _accountsConfiQuery: ConfigurationSettingQuery,
    private _authQuery: AuthQuery,
    private _configurationService: ConfigurationSettingService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this._accountsConfiQuery.hasEntity()) {
      this._configurationService.getConfigurationSetting(this._authQuery.PROFILE.CurrentOutletId);
    }
    return of(true);
  }
}
