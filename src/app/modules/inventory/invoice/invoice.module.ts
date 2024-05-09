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
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { AddInvoiceComponent } from './components/add-invoice/add-invoice.component';
import { PurchaseInvoiceComponent } from './components/purchase-invoice/purchase-invoice.component';
import { PurchaseReturnComponent } from './components/purchase-return/purchase-return.component';
import { IssuanceReturnComponent } from './components/issuance-return/issuance-return.component';
import { IssuanceInvoiceComponent } from './components/issuance-invoice/issuance-invoice.component';
import { PaginatorModule } from 'primeng/paginator';
import { AdjustmentComponent } from './components/adjustment/adjustment.component';
import { AddProductionInvoiceComponent } from './components/add-production-invoice/add-production-invoice.component';
import { ItemVendorModule } from '../item-particular/item-particular.module';

const routes: Routes = [
  {
    path: 'purchase',
    component: PurchaseInvoiceComponent, pathMatch: 'full'
  },
  {
    path: 'purchase-return',
    component: PurchaseReturnComponent, pathMatch: 'full'
  },
  {
    path: 'issuance',
    component: IssuanceInvoiceComponent, pathMatch: 'full'
  },
  {
    path: 'issuance-return',
    component: IssuanceReturnComponent, pathMatch: 'full'
  },
  {
    path: 'adjustment',
    component: AdjustmentComponent, pathMatch: 'full',
  },
]


@NgModule({
  declarations: [
    InvoiceListComponent,
    AddInvoiceComponent,
    PurchaseInvoiceComponent,
    PurchaseReturnComponent,
    IssuanceReturnComponent,
    IssuanceInvoiceComponent,
    AdjustmentComponent,
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
    PaginatorModule,
    ItemVendorModule
  ],
  providers: [
    MessageService,
    DialogService,
    ConfirmationService,
    FileViewerService
  ]
})
export class InvoiceModule { }
