import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ConfigurationSetting } from '../../models/configuration-setting.model';
import { ConfigurationSettingState, ConfigurationSettingStore } from './accounts-configuration..store';

@Injectable({ providedIn: "root" })
export class ConfigurationSettingQuery extends QueryEntity<ConfigurationSettingState> {

    public configurationSetting: ConfigurationSetting[] = [];
    public configurationSetting$: Observable<ConfigurationSetting[]>;

    constructor(
        private _configurationSettingStore: ConfigurationSettingStore
    ) {
        super(_configurationSettingStore);
        this.initialAccountsConfigProcess();
        this.configurationSetting$ = this.selectAll()
    }

    public initialAccountsConfigProcess() {
        this.configurationSetting = this.getAll();
    }

    public reset(): void {
        this.store.remove();
    }

    public saveConfigurationSetting(configurationSetting: ConfigurationSetting[]): void {
        if (configurationSetting?.length > 0) {

            this._configurationSettingStore.add(configurationSetting);
        }
    }

    getAllConfigurationList(): ConfigurationSetting[] {
        return this.getAll();
    }

    public removeConfigurationSetting(): void {
        this._configurationSettingStore.remove();
    }
}