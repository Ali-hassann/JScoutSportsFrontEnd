import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter, Subscription } from 'rxjs';
import { AppBreadcrumbService } from '../app.breadcrumb.service';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss']
})
export class BreadCrumbComponent implements OnInit {

  // subscription: Subscription | any;
  // BackButtonsubscription: Subscription | any;

  // items: MenuItem[] = [];
  // isHideBackButton: boolean = false;

  // home: MenuItem | any;

  // search: string = "";

  // constructor(
  //   public breadcrumbService: AppBreadcrumbService,
  // ) {
  //   this.subscription = breadcrumbService.itemsHandler.subscribe((response: any) => {
  //     this.items = response;
  //   });
  //   this.BackButtonsubscription = breadcrumbService.isHideBackButton.subscribe((response: any) => {
  //     this.isHideBackButton = response;
  //   });

  //   this.home = { icon: 'pi pi-home', routerLink: '/' };
  // }

  // ngOnInit(): void {
  // }
  // public goToPreviousPage(): void {
  //   history.back();
  // }
  // ngOnDestroy() {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }


//   static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
//   readonly home = { icon: 'pi pi-home', routerLink:["dashboard"] };
//   menuItems: MenuItem[] = [];

//   constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

//   ngOnInit(): void {
//     this.router.events
//       .pipe(filter(event => event instanceof NavigationEnd))
//       .subscribe(() => this.menuItems = this.createBreadcrumbs(this.activatedRoute.root));
//   }



//   private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
//     const label = route.snapshot.data[BreadCrumbComponent.ROUTE_DATA_BREADCRUMB];
//     if (label ) {
//       breadcrumbs.push({ label: label, routerLink: [url] });
//     }

//     if (route.firstChild) {
//       return this.createBreadcrumbs(route.firstChild, `${url}/${route.snapshot.url.join('/')}`, breadcrumbs);
//     }
//     else {
//       return breadcrumbs;
//     }
//   }


readonly home = { icon: 'pi pi-home', routerLink:["wellcome"] };
breadcrumbs: MenuItem[] = [];

constructor(private breadcrumbService: AppBreadcrumbService) { }

ngOnInit(): void {
  this.breadcrumbService.breadcrumbs$.subscribe(breadcrumbs => {
    this.breadcrumbs = breadcrumbs;
  });
}

}
