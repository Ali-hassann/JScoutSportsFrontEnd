import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChangePasswordResponse, UserProfile } from '../models/auth.model';
import { NgEntityService } from '@datorama/akita-ng-entity-service';
import { AuthState, AuthStore } from '../states/auth.store';
import { OrganizationProfileStore } from '../../institute-profile/states/institute-profile-state/institute-profile-store';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { AppRefereshService } from 'src/app/shared/services/app-referesh.service';
import { OrganizationOutletService } from 'src/app/shared/services/data-services/institute-branches.service';
import { Router } from '@angular/router';
import { AuthQuery } from '../states/auth.query';
import { OrganizationProfile } from '../../institute-profile/models/institute-profile.model';
import { UserRightsQuery } from 'src/app/modules/setting/rights/states/user-rights.query';
import { RightsService } from 'src/app/modules/setting/rights/services/rights.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends NgEntityService<AuthState>{

    _http: HttpClient;

    constructor(
        protected _authStore: AuthStore
        , private _organizationProfileStore: OrganizationProfileStore
        , private _hotToastService: HotToastService
        , private _userRightsQuery: UserRightsQuery
        , private _userRightsService: RightsService
        , private _appRefereshService: AppRefereshService
        , private _instituteBranchesService: OrganizationOutletService
        , private _authQuery: AuthQuery
    ) {

        super(_authStore);
        this._http = this.getHttp();
    }

    public login(loginModel: any) {

        let toast = this._hotToastService.loading("Please wait you are being logged in");

        this._http
            .post(`Users/UserLogin`, loginModel)
            .pipe
            (
                tap((profile: any) => {
                    toast = this.onSuccessfullLogin(profile, toast);
                }, error => {
                    toast.close();
                    toast = this._hotToastService.error("An error occured.Please try again");
                    setTimeout(x => {
                        window.location.href = "/";
                        toast.close();
                    }, 30000)
                })
            ).subscribe();
    }

    private onSuccessfullLogin(profile: any, toast: CreateHotToastRef<unknown>) {
        if (profile) {
            
            toast.close();
            let obj = {};
            Object.assign(obj, profile);
            this._authQuery.SetProfile(obj as UserProfile)
            // Setting Auth Store & Institute Profile Store
            this.getAndSetDefaultOutletProfile(profile);
        }
        else {
            toast.close();
            toast = this._hotToastService.error(profile.Message);
            setTimeout(x => { window.location.href = "/"; }, 30000);
        }
        return toast;
    }

    getAndSetDefaultOutletProfile(profile: UserProfile) {

        this.getOrganizationProfile(profile.OrganizationId, profile.OutletId)
            .subscribe(data => {
                if (data) {
                    this._organizationProfileStore.set([data as any]);
                    profile.OrganizationProfile = data as OrganizationProfile;
                    this._authQuery.SetProfile(profile);
                    this._userRightsService.getUserRights(profile.Id, true);
                    this._instituteBranchesService.getBranchList();
                    this._appRefereshService.fetchMasterData();
                }
            });
    }

    public loggedOut(): void {
        this._appRefereshService.ApplicationRefreshStores();
        localStorage.removeItem('currentlogin');
        this._authStore.destroy();
        this._userRightsQuery.remove();
        window.location.href = "#/";
    }

    public isUserExist(userName: any): Observable<boolean[]> {
        return this._http.get<boolean[]>(`Identity/CheckExistingUserNameOrEmail?userName=${userName}`);
    }

    public changePassword(userName: string, currentPassword: string, newPassword: string) {
        return this._http.post<ChangePasswordResponse>(`Identity/ChangePassword?username=${userName}&currentPassword=${currentPassword}&newPassword=${newPassword}`, userName)
    }

    public getOrganizationProfile(OrganizationId: number, OutletId: number) {
        // Organization/GetOrganizationProfile?organizationId=${OrganizationId}&outletId=${OutletId}
        return this._http.get(`Organization/GetOrganizationProfile?organizationId=${OrganizationId}&outletId=${OutletId}`);
    }
}
