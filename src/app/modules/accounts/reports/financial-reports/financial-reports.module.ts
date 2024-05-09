import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { FinancialReportsComponent } from './components/report-tabs/financial-reports.component';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { AccountsLedgerComponent } from '../accounts-ledger/components/accounts-ledger/accounts-ledger.component';
import { BalanceSheetComponent } from '../balance-sheet/components/balance-sheet/balance-sheet.component';
import { ProfitLossComponent } from '../profit-loss/components/profit-loss/profit-loss.component';
import { TrialBalanceComponent } from '../trial-balance/components/trial-balance/trial-balance.component';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { MessageService } from 'primeng/api';
import { SubAccountComponent } from './components/sub-account/sub-account.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: "Financial Reports" },
    component: FinancialReportsComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    FinancialReportsComponent,
    AccountsLedgerComponent,
    BalanceSheetComponent,
    ProfitLossComponent,
    TrialBalanceComponent,
    SubAccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonFormModules,
    PanelModule,
    TabViewModule,
    CalendarModule,
    TableModule,
    CheckboxModule,
    MultiSelectModule,
    CommonSharedModule
  ],
  providers: [
    MessageService
  ]
})
export class FinancialReportsModule { }
