import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { UI_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { TabsUIModel } from "../../models/charts-of-account.model";

export interface UiChartOfAccountState extends EntityState {
    ui: TabsUIModel
}

const initialState = {
    ui: new TabsUIModel()
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: UI_STORE_NAME.UI_CHARTOFACCOUNT })
export class UiChartOfAccountStore extends EntityStore<UiChartOfAccountState> {
    constructor() {
        super(initialState);
    }
}