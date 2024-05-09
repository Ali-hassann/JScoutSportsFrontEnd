import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartsOfAccountComponent } from './components/charts-of-account/charts-of-account.component';
import { PanelModule } from 'primeng/panel';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AddHeadCategoryComponent } from './components/head-category/add-head-category/add-head-category.component';
import { HeadCategoryListComponent } from './components/head-category/head-category-list/head-category-list.component';
import { MainHeadListComponent } from './components/main-head/main-head-list/main-head-list.component';
import { PostingAccountsListComponent } from './components/posting-accounts/posting-accounts-list/posting-accounts-list.component';
import { AddPostingAccountsComponent } from './components/posting-accounts/add-posting-accounts/add-posting-accounts.component';
import { AddSubCategoryComponent } from './components/sub-category/add-sub-category/add-sub-category.component';
import { SubCategoryListComponent } from './components/sub-category/sub-category-list/sub-category-list.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeModule } from 'primeng/tree';
import { TreeStructureComponent } from './components/tree-structure/tree-structure.component';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';

const routes: Routes = [
  {
    data: { breadcrumb: "Charts of Accounts" },
    path: '', component: ChartsOfAccountComponent, pathMatch: 'full'
  },
]


@NgModule({
  declarations: [
    AddHeadCategoryComponent,
    ChartsOfAccountComponent,
    HeadCategoryListComponent,
    MainHeadListComponent,
    PostingAccountsListComponent,
    AddPostingAccountsComponent,
    AddSubCategoryComponent,
    SubCategoryListComponent,
    TreeStructureComponent
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
    DialogModule
  ],
  providers: [
    DialogService,
    FileViewerService,
    MessageService
  ],
  entryComponents: [
    AddHeadCategoryComponent
  ]
})
export class ChartsOfAccountModule { }
