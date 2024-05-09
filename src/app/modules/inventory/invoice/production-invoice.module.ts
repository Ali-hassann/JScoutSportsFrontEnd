import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeModule } from 'primeng/tree';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { FileViewerService } from '../../common/file-viewer/services/file-viewer.service';
import { PaginatorModule } from 'primeng/paginator';
import { AddProductionInvoiceComponent } from './components/add-production-invoice/add-production-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: AddProductionInvoiceComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AddProductionInvoiceComponent
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
    InputNumberModule,
    InputSwitchModule,
    PaginatorModule
  ],
  providers: [
    MessageService,
    DialogService,
    ConfirmationService,
    FileViewerService
  ]
})
export class ProductionInvoiceModule { }
