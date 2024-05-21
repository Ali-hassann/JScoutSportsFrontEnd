import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';

@Component({
    templateUrl: './wellcome.component.html',
})
export class WellcomeComponent implements OnInit, OnDestroy {

    subscription!: Subscription;

    constructor(
        public layoutService: LayoutService,
        private _breadCrumbService: AppBreadcrumbService,
    ) {
    }

    ngOnInit() {
        this.setBreadCrumb();
    }

    private setBreadCrumb(): void {
        this._breadCrumbService.setBreadcrumbs([
            { label: 'Welcome' }
        ]);
    }



    clr: any[] = []

    generateUniqueColor(): any {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);

        const color = `rgba(${red},${green},${blue})`;

        if (this.clr.includes(color)) {
            return this.generateUniqueColor(); // Recursively call the function if color is already present
        }

        return color;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
