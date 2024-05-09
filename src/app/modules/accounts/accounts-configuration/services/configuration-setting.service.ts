import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigurationSetting } from '../models/configuration-setting.model';
import { ConfigurationSettingStore } from '../states/data-states/accounts-configuration..store';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationSettingService {

    constructor(
        private _http: HttpClient
        , private _accountsConfigurationStore: ConfigurationSettingStore
    ) { }

    public saveConfigurationSetting(request: ConfigurationSetting[]): Observable<ConfigurationSetting[]> {

        let url = "ConfigurationSetting/SaveConfigurationSetting";
        return this._http.post<ConfigurationSetting[]>(url, request) as Observable<ConfigurationSetting[]>;
    }

    public getConfigurationSetting(outletId: number): void {

        let url = `ConfigurationSetting/GetConfigurationSetting?outletId=${outletId}`;
        this._http
            .get<ConfigurationSetting[]>(url)
            .pipe
            (
                tap(accountsConfigurationResponse => {
                    if (accountsConfigurationResponse) {
                        this._accountsConfigurationStore.remove();
                        this._accountsConfigurationStore.reset();
                        this._accountsConfigurationStore.add(accountsConfigurationResponse);
                    }
                })
            ).subscribe();
    }
}
