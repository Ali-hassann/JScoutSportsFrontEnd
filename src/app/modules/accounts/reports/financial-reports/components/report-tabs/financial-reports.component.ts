import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { PostingAccountsResponse } from 'src/app/modules/accounts/charts-of-accounts/models/posting-accounts.model';
import { PostingAccountsQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/posting-account.query';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { Reports } from 'src/app/shared/enums/rights.enum';
import { FinancialReportRequest } from '../../models/financial-report-model.model';
import { SubCategoryQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/sub-category.query';
import { SubCategoriesRequest } from 'src/app/modules/accounts/charts-of-accounts/models/sub-category.model';

@Component({
  selector: 'app-financial-reports',
  templateUrl: './financial-reports.component.html',
  styleUrls: ['./financial-reports.component.scss']
})

export class FinancialReportsComponent implements OnInit {
  public postingAccountList: PostingAccountsResponse[] = [];
  public activeTabindex: number = 0;

  public financialReportRequest: FinancialReportRequest = new FinancialReportRequest();
  Reports = Reports;
  subCategoryList: SubCategoriesRequest[] = [];
  constructor(
    private _postingAccontQuery: PostingAccountsQuery,
    private _authQuery: AuthQuery,
    private breadcrumbService: AppBreadcrumbService,
    private _subCategoryQuery: SubCategoryQuery,
  ) {
  }

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Reports', routerLink: ['reports'] },
      { label: 'Accounts Ledger' }
    ]);
    this.postingAccountList = this._postingAccontQuery.getAllPostingAccountsList;
    this.financialReportRequest.OrganizationId = this._authQuery.OrganizationId;
    this.financialReportRequest.OutletId = this._authQuery.PROFILE.CurrentOutletId;
    this.financialReportRequest.Address = this._authQuery.PROFILE.OrganizationProfile.Address;
    this.financialReportRequest.OutletName = this._authQuery.PROFILE.OrganizationProfile.OutletName;
    this.financialReportRequest.FromDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
    this.financialReportRequest.ToDate = new Date();

    this._postingAccontQuery.selectAllPostingAccountsList$.subscribe(res => {
      this.postingAccountList = res;
    });
    this._subCategoryQuery.subCategoryList$.subscribe(res => {
      this.subCategoryList = res;
    });
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
