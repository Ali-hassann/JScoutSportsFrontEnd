import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { UserProfile } from "../models/auth.model";
import { AuthStore, AuthState } from "./auth.store";

@Injectable({ providedIn: "root" })
export class AuthQuery extends QueryEntity<AuthState> {
    private _userProfile: UserProfile | any;
    profile$ = this.select(
        (state: any) => state.entities[state.ids[0]]
    ) as Observable<UserProfile>;

    isAccountAdmin$: Observable<boolean> = this.profile$.pipe(map((data: UserProfile) => {
        return data && data?.RoleName?.toLocaleLowerCase() == "superadmin";
    }));

    hasAccountAdminRights$: Observable<boolean> = this.profile$.pipe(map((data: UserProfile) => {
        return (data && data?.RoleName?.toLocaleLowerCase() == "superadmin");
}))

constructor(protected _authStore: AuthStore) {
    super(_authStore);
    this.profile$
        .pipe(
            tap((profile) => {
                if (profile) {
                    this._userProfile = profile;
                }
            })
        )
        .subscribe();
}
    public reset(): void {
    this.store.remove();
}
    public setCurrentBranch(OutletId: number): void {
    this._userProfile = null;
    this.store.update({ CurrentBranch: OutletId, OutletId: OutletId });
}
    public SetProfile(profile: UserProfile): void {
    this.store.set([profile]);
    localStorage.removeItem('currentlogin');
    localStorage.setItem('currentlogin', JSON.stringify(profile));
}
    public get IS_LOGGED_IN(): boolean {
    return this.isLoggedIn();
}
    public get OrganizationId(): number {
    return this.PROFILE?.OrganizationId ?? 0;
}
    public get OutletId(): number {
    return this.PROFILE?.CurrentOutletId ?? this.PROFILE?.OutletId;
}
    public getOutletId(): number {
    return this.PROFILE?.CurrentOutletId ?? this.PROFILE?.OutletId;
}
    public get PROFILE(): UserProfile {
    this._userProfile = this.getAvailableProfile();
    if (!this._userProfile) {
        this._userProfile = this.getProfileFromLocalStorage();
    }
    return this._userProfile;
}

    private isLoggedIn(): boolean {
    if (!this.getAvailableProfile()) {
        if (!this.getProfileFromLocalStorage()) {
            return false;
        } else {
            // const localStorageProfile = this.getProfileFromLocalStorage();
            return true;
        }
    }
    return true;
}

    private getAvailableProfile(): UserProfile {
    return this.getAll()[0] as UserProfile;
}

    private getProfileFromLocalStorage(): UserProfile | any {
    const user = localStorage.getItem("currentlogin");
    if (user) {
        const profile: UserProfile = JSON.parse(user);
        return profile;
    }
    return null;
}
getUserId() {
    return this.getAll().find((x) => x)?.Id;
}

getUserName() {
    return this.getAll().find((x) => x)?.UserName;
}

    public getHasAdminRights(): boolean {
    return (this.PROFILE && this.PROFILE?.RoleName?.toLocaleLowerCase() == "superadmin");
}

remoeveProfile() {
    localStorage.removeItem("currentlogin");
    this.store.remove();
}

logOut() {
    this.remoeveProfile();
    window.location.href = "/";
}
}
