import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { UiInventoryTabState, UiInventoryTabStore } from "./ui-inventory-tab.store";
import { TabsUIModel } from "src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model";

@Injectable({ providedIn: 'root' })
export class UiInventoryTabQuery extends QueryEntity<UiInventoryTabState> {

  uiInventoryTab$: Observable<TabsUIModel>;

  constructor(
    override  store: UiInventoryTabStore
  ) {
    super(store);
    this.uiInventoryTab$ = this.select(state => state.ui);
    this.initialStoreValues();
  }

  public addUi(uiState: TabsUIModel) {
    this.store.add(uiState);
  }

  public updateUi(uiState: TabsUIModel) {
    this.store.update({ ui: uiState });
  }

  public getUi() {
    return this.getValue().ui;
  }

  public reset(): void {
    this.store.remove();
  }

  public initialStoreValues() {
    let ui = new TabsUIModel();
    ui.ActiveTabIndex = 0;
    this.updateUi(ui);
  }
}