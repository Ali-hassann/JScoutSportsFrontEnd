import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationRoleListComponent } from './components/organization-role-list/organization-role-list.component';
import { AddOrganizationRoleComponent } from './components/add-organization-role/add-organization-role.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { RoleRightsComponent } from './components/role-rights/role-rights.component';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';

const routes: Routes = [
  {
    data: { breadcrumb: "Roles" },
    path: '',
    component: OrganizationRoleListComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    OrganizationRoleListComponent,
    AddOrganizationRoleComponent,
    RoleRightsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PanelModule,
    TabViewModule,
    MenuModule,
    CommonFormModules,
    TableModule,
    ToggleButtonModule,
    CheckboxModule,
    CalendarModule,
    RadioButtonModule,
    TreeModule,
    CommonSharedModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule,
    DialogModule,
    //
    MessagesModule,
    MessageModule,
    CardModule,
    AccordionModule,
  ],
  providers: [
    DialogService,
    MessageService,
    DynamicDialogRef
  ],
})
export class OrganizationRoleModule { }
