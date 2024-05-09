import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { ItemOpeningListComponent } from './components/item-opening-list/item-opening-list.component';

const routes: Routes = [
  {
    path: '',
    component: ItemOpeningListComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    ItemOpeningListComponent,
    // AddItemOpeningComponent
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    TableModule,
    RouterModule.forChild(routes),
    MenuModule,
    CommonFormModules,
    CheckboxModule,
    CalendarModule,
    TreeModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    DialogModule,
    OverlayPanelModule,
    InputMaskModule,
  ],
  providers: [
    DialogService,
    ConfirmationService,
    MessageService,
  ]
})
export class ItemOpeningModule { }