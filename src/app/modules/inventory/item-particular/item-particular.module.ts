import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Routes, RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeModule } from 'primeng/tree';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { ItemVendorsListComponent } from './components/item-vendors-list/item-vendors-list.component';
import { AddItemVendorsComponent } from './components/add-item-vendors/add-item-vendors.component';
import { ParticularsComponent } from './components/particulars/particulars.component';
import { CustomersComponent } from './components/customers/customers.component';
import { OthersComponent } from './components/others/others.component';

const routes: Routes = [
  {
    path: 'vendors',
    component: ItemVendorsListComponent, pathMatch: 'full'
  },
  {
    path: 'customers',
    component: CustomersComponent, pathMatch: 'full'
  },
  {
    path: 'others',
    component: OthersComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    ItemVendorsListComponent,
    AddItemVendorsComponent,
    ParticularsComponent,
    CustomersComponent,
    OthersComponent,
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
    InputSwitchModule
  ],
  providers:[
    MessageService,
    DialogService,
    ConfirmationService,
    FileViewerService
  ]
})
export class ItemVendorModule { }