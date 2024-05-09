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
import { StitchingProcessComponent } from './processes/stitching-process.component';
import { ProductionProcessListComponent } from './production-process-list/production-process-list.component';
import { AddProductionComponent } from './add-production-process/add-production-process.component';
import { ProductionProcessResolver } from './resolver/production-process.resolver';
import { PressCuttingProcessComponent } from './processes/press-cutting-process.component';
import { ProcessTabsComponent } from './process-tabs/process-tabs.component';
import { ReceiveProcessListComponent } from './receive-process-list/receive-process-list.component';
import { EditReceiveProcessComponent } from './edit-receive-process/edit-receive-process.component';
import { PackingProcessComponent } from './processes/packing-process.component';
import { SublimationProcessComponent } from './processes/sublimation-process.component';
import { LaserCuttingProcessComponent } from './processes/laser-cutting-process.component';
import { RubberInjectionProcessComponent } from './processes/rubber-injection-process.component';
import { PuPvcPrintingProcessComponent } from './processes/pvc-printing-process.component';
import { EmbossingProcessComponent } from './processes/embossing-process.component';
import { SiliconPrintingProcessComponent } from './processes/silicon-printing-process.component';
import { ContractProcessComponent } from './processes/contract-process.component';
import { EditIssueProcessComponent } from './edit-issue-process/edit-issue-process.component';

const routes: Routes = [
  {
    path: 'packing',
    component: PackingProcessComponent, pathMatch: 'full'
    , resolve: [ProductionProcessResolver]
  },
  {
    path: 'sublimation',
    component: SublimationProcessComponent, pathMatch: 'full'
    , resolve: [ProductionProcessResolver]
  },
  {
    path: 'rubber-injection',
    component: RubberInjectionProcessComponent, pathMatch: 'full'
    , resolve: [ProductionProcessResolver]
  },
  {
    path: 'stitching',
    component: StitchingProcessComponent, pathMatch: 'full'
    , resolve: [ProductionProcessResolver]
  },
  {
    path: 'press-cutting',
    component: PressCuttingProcessComponent, pathMatch: 'full'
    , resolve: [ProductionProcessResolver]
  },
  {
    path: 'laser-cutting',
    component: LaserCuttingProcessComponent, pathMatch: 'full'
    , resolve: [ProductionProcessResolver]
  },
  {
    path: 'pu-pvc-printing',
    component: PuPvcPrintingProcessComponent, pathMatch: 'full'
    , resolve: [ProductionProcessResolver]
  },
  {
    path: 'silicon-printing',
    component: SiliconPrintingProcessComponent, pathMatch: 'full'
    , resolve: [ProductionProcessResolver]
  },
  {
    path: 'embossing',
    component: EmbossingProcessComponent, pathMatch: 'full'
    , resolve: [ProductionProcessResolver]
  },
  {
    path: 'contract',
    component: ContractProcessComponent, pathMatch: 'full'
    , resolve: [ProductionProcessResolver]
  },
]

@NgModule({
  declarations: [
    ProductionProcessListComponent,
    StitchingProcessComponent,
    AddProductionComponent,
    PressCuttingProcessComponent,
    ProcessTabsComponent,
    ReceiveProcessListComponent,
    EditReceiveProcessComponent,
    PuPvcPrintingProcessComponent,
    LaserCuttingProcessComponent,
    RubberInjectionProcessComponent,
    SublimationProcessComponent,
    PackingProcessComponent,
    EmbossingProcessComponent,
    SiliconPrintingProcessComponent,
    ContractProcessComponent,
    EditIssueProcessComponent
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
export class ProductionProcessModule { }
