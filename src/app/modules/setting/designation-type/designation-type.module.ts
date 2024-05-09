import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignationTypeListComponent } from './components/designation-type-list/designation-type-list.component';
import { AddDesignationTypeComponent } from './components/add-designation-type/add-designation-type.component';
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

const routes: Routes = [
  {
    data: { breadcrumb: "Designation Types" },
    path: '',
    component: DesignationTypeListComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    DesignationTypeListComponent,
    AddDesignationTypeComponent
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

  ],
  providers: [
    MessageService,
    DialogService,
    ConfirmationService
  ]
})
export class DesignationTypeModule { }
