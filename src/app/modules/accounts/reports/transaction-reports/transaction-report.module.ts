import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportTabsComponent } from './components/report-tabs/report-tabs.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DailyPaymentReceiptComponent } from '../daily-payment-receipt/components/daily-payment-receipt/daily-payment-receipt.component';
import { DailyTransactionReportComponent } from '../daily-transaction-report/comonents/daily-transaction-report/daily-transaction-report.component';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { MessageService } from 'primeng/api';

const routes: Routes = [
  {
    path: '', component: ReportTabsComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    ReportTabsComponent,
    DailyPaymentReceiptComponent,
    DailyTransactionReportComponent
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
export class TransactionReportModule { }
