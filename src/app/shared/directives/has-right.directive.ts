// import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
// import { Observable } from 'rxjs';
// import { skipWhile, tap } from 'rxjs/operators';
// import { UserRightsQuery } from 'src/app/modules/setting/rights/states/user-rights.query';
// import { UserRightsResponse } from '../models/user-rights.model';


// @Directive({
//   selector: '[HasRight]'
// })
// export class HasRightDirective {
//   @Input() userRightName: any;
//   public Rights$: Observable<UserRightsResponse[]> | any;
//   constructor(
//     public templateRef: TemplateRef<any>,
//     public viewContainerRef: ViewContainerRef,
//     public _userRightQuery: UserRightsQuery) {
//   }

//   ngOnInit() {


//     this.Rights$ = this._userRightQuery.selectAll();
//     this.Rights$.pipe(
//       skipWhile((rights: any) => rights?.length === 0),
//       tap((rights: any) => {
//         if (this.viewContainerRef) {
//           if (this.userRightName) {
//             let right = rights.find((right: any) => right.RightsName.toLowerCase() === this.userRightName.toString().toLowerCase());

//             if (this.userRightName && right?.HasAccess) {
//               this.viewContainerRef.createEmbeddedView(this.templateRef);
//             }
//             else {
//               this.viewContainerRef.clear();
//             }
//           } else {
//             this.viewContainerRef.clear();
//           }
//         } else {
//           // this.viewContainerRef.clear();
//         }
//       })).subscribe();
//   }
// }


import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserRightsQuery } from 'src/app/modules/setting/rights/states/user-rights.query';
@Directive({
  selector: '[hasRight]'
})
export class HasRightDirective {
  constructor(

    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private _rightQuery: UserRightsQuery

  ) { }
  @Input() set hasRight(rightName: any) {
    this.isGranted(rightName);
    // *appIsGranted="'CREATE'"
  }
  private isGranted(rightName: any) {
    if (this._rightQuery.getHasRight(rightName?.toString())) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}