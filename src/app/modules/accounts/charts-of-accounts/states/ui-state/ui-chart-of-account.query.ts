import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { TabsUIModel } from "../../models/charts-of-account.model";
import { UiChartOfAccountState, UiChartOfAccountStore } from "./ui-chart-of-account.store";

@Injectable({ providedIn: 'root' })
export class UiChartOfAccountQuery extends QueryEntity<UiChartOfAccountState> {

  uiChartOfAccount$: Observable<TabsUIModel>;

  constructor(
    override  store: UiChartOfAccountStore
  ) {
    super(store);
    this.uiChartOfAccount$ = this.select(state => state.ui);
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