import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Subscription, interval } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AdminDashboardService } from './admin-dashboard/services/admin-dashboard.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DashboardTransactionHistoryRequest, TrialBalanceDataResponse } from './admin-dashboard/models/admin-dashboard.model';
import { Dashboard } from 'src/app/shared/enums/rights.enum';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { ConfigurationSettingQuery } from '../accounts/accounts-configuration/states/data-states/accounts-configuration.query';
import { ConfigurationSetting } from '../accounts/accounts-configuration/models/configuration-setting.model';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    data: any;
    incomeExpenseData: any;
    assetData: any;
    allTrialBalData: any;
    banksChartData: any;

    incomeExpenseoptions: any;
    assetOptions: any;
    allTrialBalOptions: any;
    banksChartOptions: any;

    items!: MenuItem[];

    creditorDebitorList: any[] = [];
    transactionList: any[] = [];

    Dashboard = Dashboard;

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;
    configurationSettingList: ConfigurationSetting[] = []
    creditorsList: TrialBalanceDataResponse[] = [];
    debitorsList: TrialBalanceDataResponse[] = [];
    banksList: TrialBalanceDataResponse[] = [];

    assetAmount: number = 0;
    liabilityAmount: number = 0;
    ownerEquityAmount: number = 0;
    expenseAmount: number = 0;
    incomeAmount: number = 0;

    creditorsAmount: number = 0;
    creditorsId: number = 0;
    banksId: number = 0;
    debitorsAmount: number = 0;
    debitorsId: number = 0;
    cashAccountId: number = 0;
    cashAmount: number = 0;

    constructor(
        public layoutService: LayoutService,
        private _authQuery: AuthQuery,
        private _adminDashboardService: AdminDashboardService,
        private _breadCrumbService: AppBreadcrumbService,
        private _configurationSetting: ConfigurationSettingQuery,
    ) {
    }

    ngOnInit() {
        this.setBreadCrumb();

        this.getTrialBalanceData();
        this.getTransactionHistory();

        setInterval(() => {
            this.getTrialBalanceData();
            this.getTransactionHistory();
        }, 40000);
    }

    private setBreadCrumb(): void {
        this._breadCrumbService.setBreadcrumbs([
            { label: 'Dashboard' }
        ]);
    }



    clr: any[] = []

    generateUniqueColor(): any {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);

        const color = `rgba(${red},${green},${blue})`;

        if (this.clr.includes(color)) {
            return this.generateUniqueColor(); // Recursively call the function if color is already present
        }

        return color;
    }

    getTrialBalanceData() {
        this._adminDashboardService
            .getTrialBalanceData(this._authQuery.OutletId)
            .subscribe(data => {
                this.calculateData(data);
            });
    }

    calculateData(data: TrialBalanceDataResponse[]) {
        this.asignIdsFromConfiguration();
        this.creditorsList = data.filter(s => s.SubCategoriesId === this.creditorsId);
        this.creditorsAmount = CommonHelperService.getSumofArrayPropert(this.creditorsList, "ClosingBalance");
        this.debitorsList = data.filter(s => s.SubCategoriesId === this.debitorsId);
        this.debitorsAmount = CommonHelperService.getSumofArrayPropert(this.debitorsList, "ClosingBalance");
        this.cashAmount = data.find(d => d.PostingAccountsId === this.cashAccountId)?.ClosingBalance ?? 0;
        this.expenseAmount = data.find(d => d.MainHeadsId === 5)?.ClosingBalance ?? 0;
        this.incomeAmount = data.find(d => d.MainHeadsId === 4)?.ClosingBalance ?? 0;
        this.assetAmount = data.find(d => d.MainHeadsId === 1)?.ClosingBalance ?? 0;
        this.liabilityAmount = data.find(d => d.MainHeadsId === 2)?.ClosingBalance ?? 0;
        this.ownerEquityAmount = data.find(d => d.MainHeadsId === 3)?.ClosingBalance ?? 0;
        this.banksList = data.filter(b => b.SubCategoriesId === this.banksId);

        this.prepareIncomeExpenseChart();
        this.prepareBalanceSheetChart();
        this.prepareAllTrailBalChart();
        this.prepareBanksChart();
    }

    asignIdsFromConfiguration() {
        this.configurationSettingList = this._configurationSetting.getAllConfigurationList();
        this.creditorsId = this.configurationSettingList.find(d => d.AccountName === "Creditors")?.AccountValue ?? 0;
        this.debitorsId = this.configurationSettingList.find(d => d.AccountName === "Debtors")?.AccountValue ?? 0;
        this.cashAccountId = this.configurationSettingList.find(d => d.AccountName === "CashAccount")?.AccountValue ?? 0;
        this.banksId = this.configurationSettingList.find(d => d.AccountName === "Banks")?.AccountValue ?? 0;
    }

    public getTransactionHistory(): void {
        let request: DashboardTransactionHistoryRequest = new DashboardTransactionHistoryRequest();
        request.OrganizationId = this._authQuery.OrganizationId;
        request.OutletId = this._authQuery.OutletId;
        request.FromDate = new Date();
        request.FromDate = DateHelperService.getServerDateFormat(request.FromDate.setFullYear(request.FromDate.getFullYear() - 1));
        request.ToDate = DateHelperService.getServerDateFormat(new Date());
        request.IsActive = true;
        this._adminDashboardService.getLastTransactionHistory(request).subscribe(response => {
            if (response?.length > 0) {
                response?.forEach(x => {
                    let transaction = {
                        transaction: '#' + x.VouchersMasterId,
                        amount: x.TotalAmount,
                        date: x.CreatedDate,
                        icon: PrimeIcons.CHECK,
                        iconColor: '#0F8BFD',
                        amountColor: '#00D0DE',
                        type: x.VouchersTypeName
                    }
                    this.transactionList.push(transaction);
                })
            }
            else {
                this.creditorDebitorList = [];
            }
        },
            error => {
            });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    isToShowPayables(detailNumber: number) {
        if (detailNumber === 1) {
            this.creditorDebitorList = this.creditorsList;
        } else {
            this.creditorDebitorList = this.debitorsList;
        }
    }

    // charts
    prepareIncomeExpenseChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.incomeExpenseData = {
            labels: ['Income', 'Expense'],
            datasets: [
                {
                    data: [this.incomeAmount, this.expenseAmount],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };

        this.incomeExpenseoptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    prepareBalanceSheetChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.assetData = {
            labels: ['Asset', 'Liability', 'Owner Equity'],
            datasets: [
                {
                    data: [this.assetAmount, this.liabilityAmount, this.ownerEquityAmount],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };

        this.assetOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    prepareAllTrailBalChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.allTrialBalData = {
            labels: ['Assets', 'Liability', 'Owner Equity', 'Income', 'Expense',],
            datasets: [
                {
                    data: [this.assetAmount, this.liabilityAmount, this.ownerEquityAmount, this.incomeAmount, this.expenseAmount],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--pink-600')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--pink-500')]
                }
            ]
        };

        this.allTrialBalOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    prepareBanksChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        let labels: any[] = [];
        let data: any[] = [];

        this.banksList.forEach(b => {
            const color = this.generateUniqueColor();
            this.clr.push(color);
            labels.push(b.PostingAccountsName);
            data.push(b.ClosingBalance);
        });

        this.banksChartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Banks',
                    data: data,
                    backgroundColor: this.clr,
                    borderColor: this.clr,
                    // backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    // borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    borderWidth: 1.5
                }
            ]
        };

        this.banksChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }
    //
}
