import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { WellcomeComponent } from './wellcome.component';

const routes: Routes = [
    {
        path: '',
        data: { breadcrumb: "Welcome" },
        component: WellcomeComponent, pathMatch: 'full',
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        RouterModule.forChild(routes),
        ButtonModule,
        CommonSharedModule,
        CardModule,
        DropdownModule,
        DividerModule,
        ProgressBarModule,
        ReactiveFormsModule,
        TimelineModule
    ],
    declarations: [
        WellcomeComponent
    ]
})
export class WellcomeModule { }
