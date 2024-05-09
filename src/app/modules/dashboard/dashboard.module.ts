import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterModule, Routes } from '@angular/router';
import { DashboardDetailComponent } from './admin-dashboard/components/dashboard-detail/dashboard-detail.component';
import { TransactionHistoryComponent } from './admin-dashboard/components/transaction-history/transaction-history.component';
import { MonthlyWiseProfitLossComponent } from './admin-dashboard/components/monthly-wise-profit-loss/monthly-wise-profit-loss.component';
import { AdminDashboardComponent } from './admin-dashboard/components/admin-dashboard/admin-dashboard.component';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { DashboardComponent } from './dashboard.component';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';

const routes: Routes = [
    {
        path: '',
        data: { breadcrumb: "Dashboard" },
        component: DashboardComponent, pathMatch: 'full',
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        RouterModule.forChild(routes),
        ButtonModule,
        CommonSharedModule,
        CardModule,
        DropdownModule,
        DividerModule,
        ProgressBarModule,
        ReactiveFormsModule,
        TimelineModule
    ],
    declarations: [
        DashboardDetailComponent,
        TransactionHistoryComponent,
        MonthlyWiseProfitLossComponent,
        AdminDashboardComponent,
        DashboardComponent
    ]
})
export class DashboardModule { }
