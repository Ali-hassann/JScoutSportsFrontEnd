import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { ReportsMenues } from 'src/app/modules/accounts/reports/reports/models/reports-menu.model';
import { UserRightsQuery } from 'src/app/modules/setting/rights/states/user-rights.query';
import { MainMenuRights, Payroll } from 'src/app/shared/enums/rights.enum';

@Component({
  selector: 'app-payroll-settings',
  templateUrl: './payroll-settings.component.html',
  styleUrls: ['./payroll-settings.component.scss']
})
export class PayrollSettingsComponent implements OnInit {
  public reportsMenues: ReportsMenues[] = [];
  public allTypes: string[] = [];
  Payroll = Payroll;
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
      { label: 'Employee Setting' },
    ]);
  }

  private getSetups() {
    this.reportsMenues = [];
    if (this._userRightQuery.getHasRight(this.Payroll.CanViewDepartment)) {

      this.reportsMenues.push({
        Icon: "pi-file-pdf",
        Description: "Manage Departments",
        Name: "Departments",
        ToolTip: "Manage Departments",
        Url: 'department',
        component: null,
        Instance: null,
        Type: "Employee",
      });
    };
    if (this._userRightQuery.getHasRight(this.Payroll.CanViewDesignation)) {

      this.reportsMenues.push({
        Icon: "pi-file-pdf",
        Description: "Manage Designation",
        Name: "Designation",
        ToolTip: "Manage Designation",
        Url: 'designation',
        component: null,
        Instance: null,
        Type: "Employee",
      });
    };
    if (this._userRightQuery.getHasRight(this.Payroll.CanViewBenefitType)) {

      this.reportsMenues.push({
        Icon: "pi-file-pdf",
        Description: "Manage Allowance Types",
        Name: "Allowance Types",
        ToolTip: "Manage Allowance Types",
        Url: 'allowance-type',
        component: null,
        Instance: null,
        Type: "Employee",
      });
    };

    this.reportsMenues.push({
      Icon: "pi-file-pdf",
      Description: "Manage Gazetted Holidays",
      Name: "Gazetted Holidays",
      ToolTip: "Manage Gazetted Holidays",
      Url: 'gazetted-holiday',
      component: null,
      Instance: null,
      Type: "Employee",
    });

    this.reportsMenues.push({
      Icon: "pi-file-pdf",
      Description: "Manage Annual Leaves",
      Name: "Annual Leaves Planning",
      ToolTip: "Manage Annual Leaves",
      Url: 'annual-leaves',
      component: null,
      Instance: null,
      Type: "Employee",
    });

    this.reportsMenues.forEach(x => {
      if (!this.allTypes.includes(x.Type)) {
        this.allTypes.push(x.Type);
      }
    })
  }
}

