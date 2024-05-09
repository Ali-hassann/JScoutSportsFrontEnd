import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { tap } from 'rxjs';
import { AuthStore } from 'src/app/modules/common/auth/states/auth.store';
import { SubMenuRightsResponse, UserRightsBaseResponse, UserRightsResponse } from '../../users/models/users.models';
import { UserRightsRequest } from '../models/user-rights.model';
import { UserRightsQuery } from '../states/user-rights.query';
import { UserRightsStore } from '../states/user-rights.store';

@Injectable({
  providedIn: 'root'
})
export class RightsService {

  constructor(
    private _authStore: AuthStore,
    protected _userRightsStore: UserRightsStore,
    private _userRightsQuery: UserRightsQuery,
    private _http: HttpClient,
    private _hotToastService: HotToastService,
    private _router: Router,
  ) {
  }
  // public getUserRights(user: any | undefined, fromLoginPage?: boolean) {
  //   let tost = this._hotToastService.loading("Please wait we are getting your profile", { duration: 3000 });

  //   this._router.navigate(['app/dashboard']);
  //   // this._router.navigate(['app/admindashboard']);
  //   // this._router.navigate(['superadmindashboard']);
  //   // this._http.get<UserRightsResponse[]>(`Identity/GetUserRightsById?userId=${user?.Id}`).pipe
  //   //   (
  //   //     tap((rights: UserRightsResponse[]) => {
  //   //       if (rights && rights.length > 0) {
  //   //         let accountRights = rights.filter(rights => rights.RightsArea.includes('Accounts'));
  //   //         let hasAccessToLogin = accountRights?.find(x => x.RightsName === ALL_RIGHTS.CanLoginToAccounts && x.HasAccess);
  //   //         if (hasAccessToLogin) {
  //   //           tost.close();
  //   //           tost = this._hotToastService.success("Profile fetched successfully");
  //   //           let hasAnyRight = accountRights?.filter(x => x.HasAccess).length > 1;
  //   //           if (hasAnyRight) {
  //   //             if (this._userRightsQuery.hasEntity()) {
  //   //               this._userRightsQuery.remove();
  //   //             }
  //   //             this._userRightsQuery.add(accountRights);
  //   //             if (fromLoginPage) {
  //   //               if (user?.RoleName === USER_ROLE.SchoolAdmin) {
  //   //                 this._router.navigate(['superadmindashboard']);
  //   //               }
  //   //               else {
  //   //                 this._router.navigate(['app/admindashboard']);
  //   //               }
  //   //             }
  //   //           }
  //   //           else {
  //   //             tost.close();
  //   //             tost = this._hotToastService.error("You don't have any rights.Please contact your admin");
  //   //             setTimeout(x => {
  //   //               this.loggedOut();
  //   //             }, 5000)
  //   //           }
  //   //         }
  //   //         else {
  //   //           tost.close();
  //   //           tost = this._hotToastService.error("You don't have any rights.Please contact your admin");
  //   //           setTimeout(x => {
  //   //             this.loggedOut();
  //   //           }, 5000)
  //   //         }
  //   //       }
  //   //       else {
  //   //         tost.close();
  //   //         tost = this._hotToastService.error("You do not have rights to access this system. Please contact administrator");
  //   //         setTimeout(x => {
  //   //           this.loggedOut();
  //   //         }, 5000)
  //   //       }
  //   //     },
  //   //       error => {
  //   //         tost.close();
  //   //         tost = this._hotToastService.error("You do not have rights to access this system. Please contact administrator");
  //   //         setTimeout(x => {
  //   //           this.loggedOut();
  //   //         }, 5000)
  //   //       }
  //   //     )
  //   //   ).subscribe();
  // }




  public getUserRights(userId: string, fromLoginPage?: boolean) {
    let toast = this._hotToastService.loading("Please wait we are getting your profile");

    this._http.get<UserRightsBaseResponse[]>(`RoleRights/GetUserGivenRightsById?userId=${userId}`).pipe
      (
        tap((rights: UserRightsBaseResponse[]) => {
          if (rights && rights.length > 0) {
            // let accountRights = this.getConvertedRights(rights);
            // let hasAccessToLogin = accountRights?.find((x: any) => x.RightsName === ALL_RIGHTS.CanLoginToAccounts && x.HasAccess);
            if (rights) {
              toast.close();
              // tost = this._hotToastService.success("Profile fetched successfully");
              let hasAnyRight = rights?.filter((x: any) => x.HasAccess).length > 1;
              if (hasAnyRight) {
                if (this._userRightsQuery.hasEntity()) {
                  this._userRightsQuery.remove();
                }
                this._userRightsQuery.add(rights);
                
                if (fromLoginPage) {
                  this._router.navigate(["app/wellcome"]);
                  // this._router.navigateByUrl("/shortwait");
                  // if (user?.RoleName === USER_ROLE.SchoolAdmin) {
                  //   this._router.navigate(['superadmindashboard']);
                  // }
                  // else {
                  //   this._router.navigate(['app/admindashboard']);
                  // }
                }
                else {
                  this._router.navigateByUrl("/shortwait");
                }
              }
              else {
                toast.close();
                toast = this._hotToastService.error("You don't have any rights.Please contact your admin");
                setTimeout(x => {
                  this.loggedOut();
                }, 5000)
              }
            }
            else {
              toast.close();
              toast = this._hotToastService.error("You don't have any rights.Please contact your admin");
              setTimeout(x => {
                this.loggedOut();
              }, 5000)
            }
          }
          else {
            toast.close();
            toast = this._hotToastService.error("You do not have rights to access this system. Please contact administrator");
            setTimeout(x => {
              this.loggedOut();
            }, 5000)
          }
        }
        )
      ).subscribe();
  }

  public loggedOut(): void {
    localStorage.removeItem('currentlogin');
    this._authStore.destroy();
    this._userRightsQuery.remove();
    window.location.href = "/";
    //this._router.navigateByUrl('login');
  }
}
