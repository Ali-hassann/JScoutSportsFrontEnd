import { Component, Input, OnInit } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DashboardDetailRequest } from '../../models/admin-dashboard.model';
import { AdminDashboardService } from '../../services/admin-dashboard.service';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss']
})
export class DashboardDetailComponent implements OnInit {
  public IncomePieChartList: any;
  public ExpensePieChartList: any;
  chartList: any;
  public totalIncome: number = 0;
  public totalExpense: number = 0;
  @Input() FromDate: any;
  constructor(
    private _authQuery: AuthQuery,
    private _adminDashboardService: AdminDashboardService,
  ) { }

  ngOnInit(): void {
    this.getDashboradDetail();

  }

  ngOnChanges(changes: any): void {
    if (changes.FromDate) {
      this.getDashboradDetail();
    }
  }

  public getDashboradDetail(): void {

    let request: DashboardDetailRequest = new DashboardDetailRequest();
    request.OrganizationId = this._authQuery.OrganizationId;
    request.OutletId = this._authQuery.OutletId;
    request.FromDate = this.FromDate;
    request.ToDate = DateHelperService.getServerDateFormat(new Date());
    request.IsActive = true;
    this._adminDashboardService.getDashboardDetailByOutletId(request).subscribe(x => {
      this.totalIncome = x.Income;
      this.totalExpense = x.Expense;
      this.IncomePieChartList = {
        labels: x.MaxIncomeExpenseDetail?.filter(x => x.Type === 'Income').map(detail => detail.PostingAccountsName),
        datasets: [
          {
            data: x.MaxIncomeExpenseDetail?.filter(x => x.Type === 'Income').map(detail => detail.Amount),
            backgroundColor: [
              "#36A2EB",
              "#FF6384",
              "#FFD133",
              "#DB3719",
              "#23C306"
            ],
            hoverBackgroundColor: [
              "#36A2EB",
              "#FF6384",
              "#FFD133",
              "#DB3719",
              "#23C306"
            ]
          }
        ]
      };
      this.ExpensePieChartList = {
        labels: x.MaxIncomeExpenseDetail?.filter(x => x.Type === 'Expense').map(detail => detail.PostingAccountsName),
        datasets: [
          {
            data: x.MaxIncomeExpenseDetail?.filter(x => x.Type === 'Expense').map(detail => detail.Amount),
            backgroundColor: [
              "#36A2EB",
              "#FF6384",
              "#FFD133",
              "#DB3719",
              "#23C306"
            ],
            hoverBackgroundColor: [
              "#36A2EB",
              "#FF6384",
              "#FFD133",
              "#DB3719",
              "#23C306"
            ]
          }
        ]
      };
      this.chartList = {
        labels: ['Income', 'Expense'],
        datasets: [
          {
            data: [x.Income, x.Expense],
            backgroundColor: [
              "#36A2EB",
              "#FF6384"
            ],
            hoverBackgroundColor: [
              "#36A2EB",
              "#FF6384"
            ]
          }
        ]
      };
    })
  }
}
