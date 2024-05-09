import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Injectable()
export class AppBreadcrumbService {
    // private items: MenuItem[] = []
    // private itemsSource = new Subject<MenuItem[]>();
    // private hideBackButton = new Subject<boolean>();

    // public itemsHandler = this.itemsSource.asObservable();
    // public isHideBackButton = this.hideBackButton.asObservable();

    // setItems(items: MenuItem[], isHideBackBtn?: boolean) {
    //     this.itemsSource.next(items);
    //     // this.items.push(items)
    //     if (isHideBackBtn) {
    //         this.hideBackButton.next(true);
    //     }
    //     else {
    //         this.hideBackButton.next(false);
    //     }
    // }
    public breadCrumbs: MenuItem[] = []
    public getItems() {
        return this.breadCrumbs;
    }


    public breadcrumbs$: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);

    constructor() { }

    get breadcrumbs(): MenuItem[] {
        return this.breadcrumbs$.getValue();
    }

    set breadcrumbs(breadcrumbs: MenuItem[]) {
        this.breadcrumbs$.next(breadcrumbs);
    }

    addBreadcrumb(breadcrumb: MenuItem) {
        const breadcrumbs = this.breadcrumbs;
        breadcrumbs.push(breadcrumb);
        this.breadcrumbs = breadcrumbs;
    }
    setBreadcrumbs(breadcrumbs: MenuItem[]) {
        this.breadcrumbs$.next(breadcrumbs);
    }
    removeBreadcrumb() {
        const breadcrumbs = this.breadcrumbs;
        breadcrumbs.pop();
        this.breadcrumbs = breadcrumbs;
    }
}
