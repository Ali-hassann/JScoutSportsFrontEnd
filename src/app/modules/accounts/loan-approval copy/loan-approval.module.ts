import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanApprovalListComponent } from './components/wages-approval-list/loan-approval-list.component';
import { Routes, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DialogService } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { FileViewerService } from '../../common/file-viewer/services/file-viewer.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

const routes: Routes = [
  {
    path: '',
    component: LoanApprovalListComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    LoanApprovalListComponent
  ],
  imports: [
    CommonModule
    , RouterModule.forChild(routes)
    , TableModule
    , CalendarModule
    , CommonFormModules
    , PaginatorModule
    , CommonSharedModule
    , SplitButtonModule
    , ConfirmDialogModule
    , DialogModule
  ],
  providers: [
    DialogService
    , FileViewerService
    , MessageService
  ],
})
export class LoanApprovalModule { }
