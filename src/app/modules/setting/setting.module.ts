import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  {
    path: '',
    component: SettingComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardModule,
    DropdownModule,
  ]
})
export class SettingModule { }
