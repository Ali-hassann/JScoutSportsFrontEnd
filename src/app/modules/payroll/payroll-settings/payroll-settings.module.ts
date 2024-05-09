import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PayrollSettingsComponent } from './components/payroll-settings.component';
import { CardModule } from 'primeng/card';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';

const routes: Routes = [
  {
    path: '',
    component: PayrollSettingsComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [PayrollSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardModule,
    CommonSharedModule
  ]
})
export class PayrollSettingsModule { }
