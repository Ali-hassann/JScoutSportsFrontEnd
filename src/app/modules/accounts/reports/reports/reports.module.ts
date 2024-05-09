import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: "Reports" },
    component: ReportsComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardModule,
    DropdownModule,
    CommonSharedModule
  ]
})
export class ReportsModule { }
