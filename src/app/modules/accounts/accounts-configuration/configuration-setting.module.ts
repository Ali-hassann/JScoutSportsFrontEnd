import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationSettingComponent } from './component/accounts-configuration/configuration-setting.component';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    ConfigurationSettingComponent
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    CommonFormModules,
    DropdownModule,
    InputNumberModule,
    TableModule,
    DialogModule,
  ],
  providers: [
    DialogService,
    DynamicDialogRef
  ]
})

export class AccountsConfigurationModule { }
