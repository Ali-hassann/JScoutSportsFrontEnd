import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppConfigModule } from './config/config.module';
import { AppSidebarComponent } from "./app.sidebar.component";
import { AppLayoutComponent } from "./app.layout.component";
import { AppBreadcrumbService } from './app.breadcrumb.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';
import { TabViewModule } from 'primeng/tabview';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonSharedModule } from '../shared/modules/common-shared.module';
import { ButtonModule } from 'primeng/button';
import { UsersModule } from '../modules/setting/users/users.module';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [
        AppBreadcrumbComponent,
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
        BreadCrumbComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        AppConfigModule,
        BreadcrumbModule,
        TabViewModule,
        CommonModule,
        OverlayPanelModule,
        CommonSharedModule,
        ButtonModule,
        DynamicDialogModule,
         DialogModule,
    ],
    exports: []
    ,
    providers: [
        DialogService,
        AppBreadcrumbService,
        MessageService 
        // DynamicDialogRef,
    ]
})
export class AppLayoutModule { }