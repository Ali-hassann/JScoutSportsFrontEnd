import { Component, Input, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DashboardTransactionHistoryRequest as DashboardTransactionHistoryRequest } from '../../models/admin-dashboard.model';
import { AdminDashboardService } from '../../services/admin-dashboard.service';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
    @Input() FromDate: any;
    public transactionHistory: any[] = [];

    constructor(
        private dashboardService: AdminDashboardService,
        private _authQuery: AuthQuery,
    ) { }

    ngOnInit(): void {
        this.getTransactionHistory();
    }

    ngOnChanges(changes: any): void {
        if (changes.FromDate) {
            this.getTransactionHistory();
        }
    }

    public getTransactionHistory(): void {
        let request: DashboardTransactionHistoryRequest = new DashboardTransactionHistoryRequest();
        request.OrganizationId = this._authQuery.OrganizationId;
        request.OutletId = this._authQuery.OutletId;
        request.FromDate = this.FromDate;
        request.ToDate = DateHelperService.getServerDateFormat(new Date());
        request.IsActive = true;
        this.dashboardService.getLastTransactionHistory(request).subscribe(response => {
            if (response?.length > 0) {
                response?.forEach(x => {
                    let transaction = {
                        transaction: '#' + x.VouchersMasterId,
                        amount: x.TotalAmount,
                        date: DateHelperService.getServerDateFormat(x.CreatedDate, DateHelperService.fullDateFormat),
                        icon: PrimeIcons.CHECK,
                        iconColor: '#0F8BFD',
                        amountColor: '#00D0DE',
                        type: x.VouchersTypeName
                    }
                    this.transactionHistory.push(transaction);
                })
            }
            else {
                this.transactionHistory = [];
            }
        },
            error => {

            });
    }
}
