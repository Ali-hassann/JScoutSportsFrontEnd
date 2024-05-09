import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { ConfigurationSetting } from '../../models/configuration-setting.model';

export interface ConfigurationSettingState extends EntityState<ConfigurationSetting> { }

export function createInitialState(): ConfigurationSettingState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({
    name: DATA_STORE_NAME.CONFIGURATIONSETTING,
    idKey: 'ConfigurationSettingId'
})

export class ConfigurationSettingStore extends EntityStore<ConfigurationSettingState> {
    constructor() {
        super()
    }
}