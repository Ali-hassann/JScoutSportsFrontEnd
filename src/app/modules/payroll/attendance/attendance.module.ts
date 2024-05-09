import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceListComponent } from './components/attendance-list/attendance-list.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { AttendanceDetailComponent } from './components/attendance-detail/attendance-detail.component';
import {InputMaskModule} from 'primeng/inputmask';
import { ConfirmationService, MessageService } from 'primeng/api';

const routes: Routes = [
  {
    path: '',
    component: AttendanceListComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    AttendanceListComponent,
    AttendanceDetailComponent
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
  ],
  providers:[
    DialogService,
    ConfirmationService,
    MessageService, 
  ]
})
export class AttendanceModule { }
