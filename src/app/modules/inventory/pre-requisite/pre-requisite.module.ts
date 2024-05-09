import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddItemTypesComponent } from './item-types/components/add-item-types/add-item-types.component';
import { ItemTypesListComponent } from './item-types/components/item-types-list/item-types-list.component';
import { ItemCategoryListComponent } from './item-category/components/item-category-list/item-category-list.component';
import { AddItemCategoryComponent } from './item-category/components/add-item-category/add-item-category.component';
import { AddItemBrandsComponent } from './item-brands/components/add-item-brands/add-item-brands.component';
import { ItemBrandsListComponent } from './item-brands/components/item-brands-list/item-brands-list.component';
import { ItemBundleListComponent } from './item-bundle/components/item-bundle-list/item-bundle-list.component';
import { AddItemBundleComponent } from './item-bundle/components/add-item-bundle/add-item-bundle.component';
import { AddItemUnitsComponent } from './item-units/components/add-item-units/add-item-units.component';
import { ItemUnitsListComponent } from './item-units/components/item-units-list/item-units-list.component';
import { AddItemsComponent } from './items/components/add-items/add-items.component';
import { ItemsListComponent } from './items/components/items-list/items-list.component';
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
import { AddItemVendorComponent } from './item-vendor/components/add-item-vendor/add-item-vendor.component';
import { ColorPickerModule } from 'primeng/colorpicker';

const routes: Routes = [
  {
    path: '',
    component: PreRequisiteComponent, pathMatch: 'full'
  },

  // {
  //   path: 'item-vendors',
  //   component: ItemVendorListComponent, pathMatch: 'full'
  // },
 
]

@NgModule({
  declarations: [
    AddItemTypesComponent,
    ItemTypesListComponent,
    ItemCategoryListComponent,
    AddItemCategoryComponent,
    AddItemBrandsComponent,
    ItemBrandsListComponent,
    ItemBundleListComponent,
    AddItemBundleComponent,
    AddItemUnitsComponent,
    ItemUnitsListComponent,
    AddItemsComponent,
    ItemsListComponent,
    PreRequisiteComponent,
    // ItemVendorListComponent,
    AddItemVendorComponent,
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
  ],
  providers: [
    MessageService,
    DialogService,
    ConfirmationService,
    FileViewerService
  ]
})
export class PreRequisiteModule { }
