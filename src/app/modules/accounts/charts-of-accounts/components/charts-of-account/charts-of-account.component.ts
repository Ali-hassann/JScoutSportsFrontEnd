import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { COA } from 'src/app/shared/enums/rights.enum';
import { UiChartsOfAccount } from '../../models/charts-of-account.model';
import { UiChartOfAccountQuery } from '../../states/ui-state/ui-chart-of-account.query';

@Component({
  selector: 'app-charts-of-account',
  templateUrl: './charts-of-account.component.html',
  styleUrls: ['./charts-of-account.component.scss']
})
export class ChartsOfAccountComponent implements OnInit {
  public display: boolean = true;
  public activeTabindex: number = 0;
  COA = COA;
  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private _uiChartOfAccountQuery: UiChartOfAccountQuery,
    private route: ActivatedRoute

  ) {
    this.setBreadCrumb('Main Heads');
  }

  public ngOnInit(): void {
    this.uiDataBinding();
  }

  public setBreadCrumb(name: string): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Charts of Accounts' },
      { label: name },
    ]);

  }

  private uiDataBinding(): void {
    let ui = this._uiChartOfAccountQuery.getUi();
    if (ui) {
      this.activeTabindex = ui?.ActiveTabIndex;
    }
  }

  public onTabChange(event: any): void {
    if (event?.index > -1) {
      this.setBreadCrumb(event.originalEvent?.currentTarget?.innerText);
    }
    this.activeTabindex = event.index;
  }

  private ngOnDestroy(): void {
    let ui = new UiChartsOfAccount();
    ui.ActiveTabIndex = this.activeTabindex;
    this._uiChartOfAccountQuery.updateUi(ui);
  }

}
