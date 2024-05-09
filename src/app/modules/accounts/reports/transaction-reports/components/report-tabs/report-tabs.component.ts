import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { Reports } from 'src/app/shared/enums/rights.enum';
import { TransactionReportRequest } from '../../transaction-report-model.model';

@Component({
  selector: 'app-report-tabs',
  templateUrl: './report-tabs.component.html',
  styleUrls: ['./report-tabs.component.scss']
})
export class ReportTabsComponent implements OnInit {
  public activeTabindex: number = 0;
  public transactionReportRequest: TransactionReportRequest = new TransactionReportRequest();
  Reports = Reports;
  constructor(
    private _authQuery: AuthQuery,
    private breadcrumbService: AppBreadcrumbService,
  ) {
  }

  ngOnInit(): void {

    this.breadcrumbService.setBreadcrumbs([
      { label: 'Reports', routerLink: ['reports'] },
      { label: 'Daily Transaction' }
    ]);

    this.transactionReportRequest.OrganizationId = this._authQuery.OrganizationId;
    this.transactionReportRequest.OutletId = this._authQuery.PROFILE.CurrentOutletId;
    this.transactionReportRequest.Address = this._authQuery.PROFILE.OrganizationProfile.Address;
    this.transactionReportRequest.OutletName = this._authQuery.PROFILE.OrganizationProfile.OutletName;
    this.transactionReportRequest.FromDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
    this.transactionReportRequest.ToDate = new Date();
  }

  public setBreadCrumb(name: string): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Reports', routerLink: ['reports'] },
      { label: name },
    ]);

  }

  public onTabChange(event: any): void {
    if (event?.index > -1) {
      this.setBreadCrumb(event.originalEvent?.currentTarget?.innerText);
    }
    this.activeTabindex = event.index;
  }
}
