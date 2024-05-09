import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { UserRightsQuery } from 'src/app/modules/setting/rights/states/user-rights.query';
import { Reports } from 'src/app/shared/enums/rights.enum';
import { UserRightsResponse } from 'src/app/shared/models/user-rights.model';

import { ReportsMenues } from './models/reports-menu.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  public reportsMenues: ReportsMenues[] = [];
  public Rights$: Observable<UserRightsResponse[]>;
  public allTypes: string[] = [];
  Reports = Reports;
  constructor(
    private _breadCrumbService: AppBreadcrumbService,
    public _userRightQuery: UserRightsQuery
  ) {
    this.Rights$ = this._userRightQuery.selectAll();
  }

  ngOnInit(): void {
    this.setBreadCrumb();
    this.getSetups();
  }

  private setBreadCrumb(): void {
    this._breadCrumbService.setBreadcrumbs([
      { label: 'Reports', routerLink: ['reports']}
    ]);
  }

  private getSetups() {
    this.reportsMenues = [];
    if (this._userRightQuery.getHasRight(this.Reports.CanViewFinancialReports)) {
      {
        this.reportsMenues.push({
          Icon: "pi-file-pdf",
          Description: "Financial Reports",
          Name: "Financial Report",
          ToolTip: "Check the Financial reports",
          Url: 'financialreports',
          component: null,
          Instance: null,
          Type: "Ledger",
        });
      };
    }

    if (this._userRightQuery.getHasRight(this.Reports.CanViewTransactionReports)) {

      {
        this.reportsMenues.push({
          Icon: "pi-file-pdf",
          Description: "Check the reports of Daily Transaction",
          Name: "Transaction Reports",
          ToolTip: "Check the reports of Daily Transaction",
          Url: 'transaction',
          component: null,
          Instance: null,
          Type: "Ledger",
        });
      };
    }



    this.reportsMenues.forEach(x => {
      if (!this.allTypes.includes(x.Type)) {
        this.allTypes.push(x.Type);
      }
    })
  }

  hasRight(rights: UserRightsResponse[], rightName: string) {
    let find = rights.find(x => x.RightsName === rightName && x.HasAccess)
    if (find) {
      return true;
    }
    else {
      return false;
    }
  }
}
