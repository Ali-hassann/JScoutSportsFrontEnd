import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { PersonListComponent } from './components/person-list/person-list.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { EmployeeSummaryComponent } from './components/employee-summary/employee-summary.component';
import { TabViewModule } from 'primeng/tabview';
import { EmployeeLoanListComponent } from '../loan/components/employee-loan-list/employee-loan-list.component';
import { AddEmployeeLoanComponent } from '../loan/components/add-employee-loan/add-employee-loan.component';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EmployeeDocumentListComponent } from '../employee-documents/components/employee-document-list/employee-document-list.component';
import { ImageModule } from 'primeng/image';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { GalleryModule } from '../../common/gallery/gallery.module';
import { EmployeeAttendanceSummaryComponent } from '../employee-summary-attendance/components/employee-attendance-summary/employee-attendance-summary.component';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { FileViewerService } from '../../common/file-viewer/services/file-viewer.service';
import { AddEmployeeAllowanceComponent } from '../employee-allowance/components/add-employee-allowance/add-employee-allowance.component';
import { EmployeeAllowanceListComponent } from '../employee-allowance/components/employee-allowance-list/employee-allowance-list.component';
import { ContractorComponent } from './components/contractor/contractor.component';
import { EmployeeComponent } from './components/employee/employee.component';

const routes: Routes = [
  {
    path: 'employees',
    component: EmployeeComponent, pathMatch: 'full'
  },
  {
    path: 'contractors',
    component: ContractorComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AddEmployeeComponent,
    ContractorComponent,
    PersonListComponent,
    EmployeeComponent,
    EmployeeSummaryComponent,
    EmployeeLoanListComponent,
    AddEmployeeLoanComponent,
    AddEmployeeAllowanceComponent,
    EmployeeAllowanceListComponent,
    EmployeeDocumentListComponent,
    EmployeeAttendanceSummaryComponent,
  ],
  imports: [
    CommonModule,
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
    AccordionModule,
    CalendarModule,
    ToggleButtonModule,
    MultiSelectModule,
    TabViewModule,
    //new
    FileUploadModule,
    RippleModule,
    RadioButtonModule,
    InputSwitchModule,
    ToolbarModule,
    ImageModule,
    MenuModule,
    OverlayPanelModule,
    GalleryModule,
    CommonSharedModule
  ],
  providers: [
    MessageService,
    DialogService,
    ConfirmationService,
    FileViewerService
  ],
  exports: [
    EmployeeSummaryComponent
  ]
})
export class EmployeeModule { }
