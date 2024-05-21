import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { TabsUIModel } from "src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model";
import { UI_STORE_NAME } from "src/app/shared/enums/stores.enum";

export interface UiInventoryTabState extends EntityState {
    ui: TabsUIModel
}

const initialState = {
    ui: new TabsUIModel()
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: UI_STORE_NAME.UI_INVENTORY })
export class UiInventoryTabStore extends EntityStore<UiInventoryTabState> {
    constructor() {
        super(initialState);
    }
}