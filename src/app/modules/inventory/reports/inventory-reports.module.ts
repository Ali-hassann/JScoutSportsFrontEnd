import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { InventoryReportTabsComponent } from './components/report-tabs/report-tabs.component';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { ItemReportTabComponent } from './components/item-reports-tab/item-reports-tab.component';
const routes: Routes = [
  {
    path: '',
    component: InventoryReportTabsComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    InventoryReportTabsComponent,
    ItemReportTabComponent,],
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
export class InventoryReportsModule { }
