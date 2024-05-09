import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { PayrollReportTabsComponent } from './components/report-tabs/report-tabs.component';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { PreRequisitReportTabComponent } from './components/pre-requisits-tab/pre-requisits-tab.component';
import { PayrollReportTabComponent } from './components/payroll-reports-tab/payroll-report-tab.component';
import { AttendanceReportTabComponent } from './components/attendance-reports-tab/attendance-reports-tab.component';
import { ToolbarModule } from 'primeng/toolbar';
import { OvertimeReportTabComponent } from './components/overtime-reports-tab/overtime-reports-tab.component';
import { MessageService } from 'primeng/api';
const routes: Routes = [
  {
    path: '',
    component: PayrollReportTabsComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    PayrollReportTabsComponent,
    PreRequisitReportTabComponent,
    PayrollReportTabComponent,
    AttendanceReportTabComponent,
    OvertimeReportTabComponent],
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
    ToolbarModule
  ],
  providers: [
    MessageService
  ]
})
export class PayrollEmployeeReportsModule { }
