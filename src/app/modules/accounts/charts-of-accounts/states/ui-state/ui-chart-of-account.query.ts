import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { UiChartsOfAccount } from "../../models/charts-of-account.model";
import { UiChartOfAccountState, UiChartOfAccountStore } from "./ui-chart-of-account.store";

@Injectable({ providedIn: 'root' })
export class UiChartOfAccountQuery extends QueryEntity<UiChartOfAccountState> {

  uiChartOfAccount$: Observable<UiChartsOfAccount>;

  constructor(
    override  store: UiChartOfAccountStore
  ) {
    super(store);
    this.uiChartOfAccount$ = this.select(state => state.ui);
    this.initialStoreValues();
  }

  public addUi(uiState: UiChartsOfAccount) {
    this.store.add(uiState);
  }

  public updateUi(uiState: UiChartsOfAccount) {
    this.store.update({ ui: uiState });
  }

  public getUi() {
    return this.getValue().ui;
  }

  public reset(): void {
    this.store.remove();
  }

  public initialStoreValues() {
    let ui = new UiChartsOfAccount();
    ui.ActiveTabIndex = 0;
    this.updateUi(ui);
  }

}