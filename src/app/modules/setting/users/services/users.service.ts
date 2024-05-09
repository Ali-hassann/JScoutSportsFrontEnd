import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRightsRequest } from '../../rights/models/user-rights.model';
import { ChangePassword, SuccessMessageResponse, UserRightsResponse, Users } from '../models/users.models';
import { UserQuery } from '../states/data-state/user-query';
import { tap } from "rxjs/operators";
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(

    private _http: HttpClient,
    private _authQuery: AuthQuery,
    private _userQuery: UserQuery,
  ) { }

  // public getUsersList(OrganizationId: number, OutletIds: string): Observable<Users[]> {
  //   let url = `Identity/GetUsers?OrganizationId=${OrganizationId}&OutletIds=${OutletIds}`;
  //   return this._http.get<Users[]>(url) as Observable<Users[]>;
  // }

  public addUser(user: Users): Observable<Users> {
    return this._http.post<Users>(`Users/AddUser`, user) as Observable<Users>;
  }
  public updateUser(user: Users): Observable<Users> {
    return this._http.post<Users>(`Users/UpdateUser`, user) as Observable<Users>;
  }

  public saveUserRightsList(userRights: UserRightsRequest[]) {
    return this._http.post<boolean>(`RoleRights/SaveUserRightsList`, userRights);
  }
  
  public checkExistingUsernameEmail(username: string, email: string): Observable<boolean> {
    return this._http.get<boolean>(`Users/CheckExistingUserNameOrEmail?userName=${username}&email=${email}`) as Observable<boolean>;
  }

  public getUsersList(): void {
    let url = `Users/GetUsers?organizationId=${this._authQuery.OrganizationId}&outletId=${this._authQuery.getOutletId()}`;
    this._http
      .get<Users[]>(url)
      .pipe(
        tap((data: Users[]) => {
          if (data?.length > 0) {
            this._userQuery.addUsers(data);
          } else {
            this._userQuery.addUsers([]);
          }
        })
      )
      .subscribe();
  }

  public getUserAllRightsById(userId: string): Observable<UserRightsResponse[]> {
    return this._http.get(`RoleRights/GetUserAllRightsById?userId=${userId}`) as Observable<UserRightsResponse[]>;
  }

  public getUserGivenRightsById(userId: string): Observable<UserRightsResponse[]> {
    return this._http.get(`RoleRights/GetUserGivenRightsById?userId=${userId}`) as Observable<UserRightsResponse[]>;
  }


  public changePassword(request: ChangePassword): Observable<SuccessMessageResponse> {
    return this._http.post<SuccessMessageResponse>(`Users/ChangePassword?username=${request.UserName}&currentPassword=${request.CurrentPassword}&newPassword=${request.ConfirmPassword}`, null);
  }
  public resetPassword(request: ChangePassword): Observable<SuccessMessageResponse> {
    return this._http.post<SuccessMessageResponse>(`Users/ResetPassword?username=${request.UserName}&newPasword=${request.ConfirmPassword}`, null);
  }
  public deleteUser(userId: string): Observable<SuccessMessageResponse> {
    return this._http.post<SuccessMessageResponse>(`Users/DeleteUser?userId=${userId}`, null);
  }
}
