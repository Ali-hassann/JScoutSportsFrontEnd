import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreRequisiteComponent } from './pre-requisite/pre-requisite.component';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeModule } from 'primeng/tree';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FileViewerService } from '../../common/file-viewer/services/file-viewer.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ProductCategoryListComponent } from './product-category/components/product-category-list/product-category-list.component';
import { AddProductCategoryComponent } from './product-category/components/add-product-category/add-product-category.component';
import { AddProductComponent } from './products/components/add-product/add-product.component';
import { ProductListComponent } from './products/components/product-list/product-list.component';
import { ProcessTypeListComponent } from './process-type/components/process-type-list/process-type-list.component';
import { AddProcessTypeComponent } from './process-type/components/add-process-type/add-process-type.component';
import { ProcessListComponent } from './process/components/process-list/process-list.component';
import { PlaningListComponent } from './planing/components/planing-list/planing-list.component';
import { TransferProcessComponent } from './process/components/transfer-process/transfer-process.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { AddProductSizeComponent } from './item-units/components/add-product-size/add-product-size.component';
import { ProductSizeListComponent } from './item-units/components/product-size-list/product-size-list.component';
import { AddItemPlaningComponent } from './planing/components/add-item-planing/add-item-planing.component';
import { AddProcessComponent } from './process/components/add-process/add-process.component';

const routes: Routes = [
  {
    path: '',
    component: PreRequisiteComponent, pathMatch: 'full'
  },

  {
    path: 'product-pre-requisite',
    component: ProductCategoryListComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    ProductCategoryListComponent,
    AddProductCategoryComponent,
    ProcessTypeListComponent,
    AddProcessTypeComponent,
    ProcessListComponent,
    AddProcessComponent,
    AddProductComponent,
    ProductListComponent,
    PreRequisiteComponent,
    PlaningListComponent,
    AddItemPlaningComponent,
    TransferProcessComponent,
    ProductSizeListComponent,
    AddProductSizeComponent
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
    ColorPickerModule,
    MultiSelectModule
  ],
  providers: [
    MessageService,
    DialogService,
    ConfirmationService,
    FileViewerService
  ]
})
export class PreRequisiteModule { }