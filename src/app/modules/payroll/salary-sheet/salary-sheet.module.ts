import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SalarySheetListComponent } from './components/salary-sheet-list/salary-sheet-list.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { FileViewerService } from '../../common/file-viewer/services/file-viewer.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EmployeeModule } from '../employee/employee.module';

const routes: Routes = [
  {
    path: '',
    component: SalarySheetListComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    SalarySheetListComponent
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    TableModule,
    RouterModule.forChild(routes),
    MenuModule,
    CommonFormModules,
    CheckboxModule,
    CalendarModule,
    TreeModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    DialogModule,
    OverlayPanelModule,
    InputMaskModule,
    ConfirmDialogModule,
    EmployeeModule
  ],
  providers: [
    ConfirmationService
    , FileViewerService
    , DialogService
    , MessageService
    ,DecimalPipe
  ]
})
export class SalarySheetModule { }
