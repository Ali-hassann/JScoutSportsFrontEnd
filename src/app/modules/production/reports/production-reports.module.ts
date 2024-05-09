import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { ProductionReportTabsComponent } from './components/report-tabs/report-tabs.component';
import { ProductReportTabComponent } from './components/order-reports-tab/order-reports-tab.component';
import { OrderConsumptionReportTabComponent } from './components/order-consumtion-report-tab/order-consumtion-report-tab.component';
const routes: Routes = [
  {
    path: '',
    component: ProductionReportTabsComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    ProductionReportTabsComponent,
    ProductReportTabComponent,
    OrderConsumptionReportTabComponent,],
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
export class ProductionReportsModule { }
