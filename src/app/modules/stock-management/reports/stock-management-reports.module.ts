import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { StockManagementReportTabsComponent } from './components/report-tabs/report-tabs.component';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { ItemLedgerReportTabComponent } from './components/item-ledger-reports-tab/item-ledger-reports-tab.component';
import { TransactionReportTabComponent } from './components/transaction-reports-tab/transaction-reports-tab.component';
import { DropdownModule } from 'primeng/dropdown';
import { SummaryReportTabComponent } from './components/summary-reports-tab/summary-reports-tab.component';
import { PartyLedgerReportTabComponent } from './components/party-ledger-reports-tab/party-ledger-reports-tab.component';
const routes: Routes = [
  {
    path: '',
    component: StockManagementReportTabsComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    StockManagementReportTabsComponent,
    ItemLedgerReportTabComponent,
    PartyLedgerReportTabComponent,
    TransactionReportTabComponent,
    SummaryReportTabComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardModule,
    CommonSharedModule,
    CommonFormModules,
    PanelModule,
    TabViewModule,
    CalendarModule,
    TableModule,
    CheckboxModule,
    MultiSelectModule,
    DropdownModule,
    ToolbarModule
  ],
  providers: [
    MessageService
  ]
})
export class StockManagementReportsModule { }
