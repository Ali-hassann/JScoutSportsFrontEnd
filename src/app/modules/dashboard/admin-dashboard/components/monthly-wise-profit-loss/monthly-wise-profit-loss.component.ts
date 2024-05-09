import { Component, Input, OnInit } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DashboardMonthWiseProfitLossRequest } from '../../models/admin-dashboard.model';
import { AdminDashboardService } from '../../services/admin-dashboard.service';

@Component({
    selector: 'app-monthly-wise-profit-loss',
    templateUrl: './monthly-wise-profit-loss.component.html',
    styleUrls: ['./monthly-wise-profit-loss.component.scss']
})
export class MonthlyWiseProfitLossComponent implements OnInit {
    visitorChart: any;
    revenueChart: any;
    @Input() FromDate:any;
    visitorChartOptions = {
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    color: 'black'
                }
            },
        },
        responsive: true,
        hover: {
            mode: 'index'
        },
        scales: {
            y: {
                ticks: {
                    color: 'black'
                }
                ,
                grid: {
                    display: false
                }
            },
            x: {
                ticks: {
                    color: 'black'
                },
                barPercentage: 0.5,
                grid: {
                    display: false
                }
            }
        }
    };

    revenueChartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: 'black'
                }
            }
        },
        responsive: true,
        hover: {
            mode: 'index'
        },
        scales: {
            x: {
                ticks: {
                    color: 'black'
                },
            },
            y: {
                ticks: {
                    color: 'black',
                    min: 0,
                    max: 60,
                    stepSize: 5
                }
            }
        }
    };
    public currentdate = new Date();
    constructor(
        private _authQuery: AuthQuery,
        private _adminDashboardService: AdminDashboardService,
    ) { }

    ngOnInit(): void {

        this.getDashboradMonthWiseSummay();
    }

    public getDashboradMonthWiseSummay(): void {

        let request: DashboardMonthWiseProfitLossRequest = new DashboardMonthWiseProfitLossRequest();
        request.OrganizationId = this._authQuery.OrganizationId;
        request.OutletId = this._authQuery.OutletId;
        request.Year = new Date(this.currentdate)?.getFullYear();
        request.MonthId = new Date(this.currentdate)?.getMonth();
        request.IsActive = true;
        this._adminDashboardService.getDashboardMonthWiseProfitLossSummary(request).subscribe(x => {
            this.visitorChart = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Income',
                        data: x?.map(summary => summary.Income),
                        backgroundColor: getComputedStyle(document.body).getPropertyValue('--primary-color'),
                    },
                    {
                        label: 'Expense',
                        data: x?.map(summary => summary.Expense),
                        backgroundColor: '#FF6384',
                    }
                ]
            };
            this.revenueChart = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'Income',
                        data: x?.map(summary => summary.Income),
                        borderColor: '#00D0DE',
                        pointBackgroundColor: '#00D0DE',
                        backgroundColor: 'rgba(0, 208, 222, 0.05)',
                        fill: true,
                        tension: .4
                    },
                    {
                        label: 'Expenses',
                        data: x?.map(summary => summary.Expense),
                        borderColor: '#FC6161',
                        pointBackgroundColor: '#FC6161',
                        backgroundColor: 'rgba(253, 72, 74, 0.05)',
                        fill: true,
                        tension: .4
                    }]
            };
        })
    }

}
