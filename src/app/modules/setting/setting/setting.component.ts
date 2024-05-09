import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { ReportsMenues } from 'src/app/modules/accounts/reports/reports/models/reports-menu.model';
import { MainMenuRights } from 'src/app/shared/enums/rights.enum';
import { UserRightsQuery } from '../rights/states/user-rights.query';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  public reportsMenues: ReportsMenues[] = [];
  public allTypes: string[] = [];
  MainMenuRights = MainMenuRights;
  constructor(
    private _breadCrumbService: AppBreadcrumbService,
    public _userRightQuery: UserRightsQuery

  ) {
  }

  ngOnInit(): void {
    this.setBreadCrumb();
    this.getSetups();
  }

  private setBreadCrumb(): void {
    this._breadCrumbService.setBreadcrumbs([
      { label: 'Setting', routerLink: ['setting'] }
    ]);
  }

  private getSetups() {
    this.reportsMenues = [];
    if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewUsers)) {
      {
        this.reportsMenues.push({
          Icon: "pi-users",
          Description: "Manage Users",
          Name: "Users",
          ToolTip: "Manage Users",
          Url: 'users',
          component: null,
          Instance: null,
          Type: "Main",
        });
      };
    }
    if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewRole)) {
      {
        this.reportsMenues.push({
          Icon: "pi-file-pdf",
          Description: "Manage Organization Role",
          Name: "Organization Roles",
          ToolTip: "Manage Organization Role",
          Url: 'roles',
          component: null,
          Instance: null,
          Type: "Main",
        });
      };
    }

    this.reportsMenues.forEach(x => {
      if (!this.allTypes.includes(x.Type)) {
        this.allTypes.push(x.Type);
      }
    })
  }

}
