import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAllowanceTypeComponent } from './components/add-allowance-type/add-allowance-type.component';
import { AllowanceTypeListComponent } from './components/allowance-type-list/allowance-type-list.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
  {
    data: { breadcrumb: "Allowance Types" },
    path: '',
    component: AllowanceTypeListComponent, pathMatch: 'full'
  }
]


@NgModule({
  declarations: [
    AddAllowanceTypeComponent,
    AllowanceTypeListComponent
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    RouterModule.forChild(routes),
    TableModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DialogModule,
    CommonFormModules,
    DropdownModule,

  ],
  providers: [
    MessageService,
    DialogService,
    ConfirmationService
  ]
})
export class AllowanceTypesModule { }
