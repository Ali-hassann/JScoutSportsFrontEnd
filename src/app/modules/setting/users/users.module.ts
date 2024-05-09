import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { UserRightsComponent } from './components/user-rights/user-rights.component';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: "Users" },
    component: UserListComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AddUserComponent,
    UserListComponent,
    UserRightsComponent,
    ChangePasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    ProgressBarModule,
    TooltipModule,
    TabViewModule,
    CardModule,
    DropdownModule,
    InputSwitchModule,
    CommonFormModules,
    DynamicDialogModule,
    DialogModule,
    AccordionModule,
    CheckboxModule,
    CommonSharedModule,
    // ConfirmPopupModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
  ],
  providers: [
    DialogService,
    DynamicDialogRef,
    ConfirmationService,
    MessageService
  ]
})

export class UsersModule {
  constructor() {
  }
}
