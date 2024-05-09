import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollDashboardComponent } from './components/payroll-dashboard/payroll-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';

const routes: Routes = [
  {
    path: '',
    component: PayrollDashboardComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    PayrollDashboardComponent
  ],
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
    TimelineModule
  ]
})
export class PayrollDashboardModule { }
