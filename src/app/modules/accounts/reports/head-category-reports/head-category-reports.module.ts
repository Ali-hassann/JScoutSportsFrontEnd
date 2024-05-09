import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadCategoryReportsComponent } from './components/head-category-reports/head-category-reports.component';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DialogService } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { FileViewerModule } from 'src/app/modules/common/file-viewer/file-viewer.module';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';


const routes: Routes = [
  {
    path: '', component: HeadCategoryReportsComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    HeadCategoryReportsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonFormModules,
    CalendarModule,
    TableModule,
    PaginatorModule,
    FileViewerModule,
    CheckboxModule,
  ],
  providers: [
    FileViewerService,
    DialogService,
    MessageService
  ]
})
export class HeadCategoryReportsModule { }
