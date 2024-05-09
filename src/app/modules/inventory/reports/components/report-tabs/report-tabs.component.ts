import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { PayrollReports } from 'src/app/shared/enums/rights.enum';

@Component({
  selector: 'app-report-tabs',
  templateUrl: './report-tabs.component.html',
  styleUrls: ['./report-tabs.component.scss']
})
export class InventoryReportTabsComponent implements OnInit {
  public activeTabindex: number = 0;

  PayrollReports=PayrollReports;

  constructor(
    private _authQuery: AuthQuery,
    private breadcrumbService: AppBreadcrumbService,
  ) {
  }

  ngOnInit(): void {

    this.breadcrumbService.setBreadcrumbs([
      { label: 'Reports' }
    ]);
  }

  public onTabChange(event: any): void {
    this.activeTabindex = event.index;
  }
}
