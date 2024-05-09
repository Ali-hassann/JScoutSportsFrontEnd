import { Component, OnDestroy } from '@angular/core';
import { AppBreadcrumbService } from './app.breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AppLayoutComponent } from './app.layout.component';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnDestroy {

    // subscription: Subscription;
    // BackButtonsubscription: Subscription;

    items: MenuItem[] = [];
    isHideBackButton: boolean = false;

    home: MenuItem;

    search: string = "";

    constructor(public breadcrumbService: AppBreadcrumbService, public appMain: AppLayoutComponent) {
        // this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
        //     this.items = response;
        // });
        // this.BackButtonsubscription = breadcrumbService.isHideBackButton.subscribe(response => {
        //     this.isHideBackButton = response;
        // });

        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }
    public goToPreviousPage(): void {
        history.back();
    }
    ngOnDestroy() {
        // if (this.subscription) {
        //     this.subscription.unsubscribe();
        // }
    }
}
