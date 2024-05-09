import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAnnualLeaveComponent } from './components/add-annual-leave/add-annual-leave.component';
import { AnnualLeaveListComponent } from './components/annual-leave-list/annual-leave-list.component';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { CalendarModule } from 'primeng/calendar';

const routes: Routes = [
  {
    data: { breadcrumb: "Annual Leaves" },
    path: '',
    component: AnnualLeaveListComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AddAnnualLeaveComponent,
    AnnualLeaveListComponent
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    RouterModule.forChild(routes),
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    ConfirmDialogModule,
    CommonFormModules,
    CalendarModule
  ],
  providers: [
    MessageService,
    DialogService,
    ConfirmationService
  ]
})
export class AnnualLeaveModule { }
