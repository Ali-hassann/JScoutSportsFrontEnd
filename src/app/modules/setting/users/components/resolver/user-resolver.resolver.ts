import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { UserQuery } from '../../states/data-state/user-query';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<boolean> {
  constructor(
    private _userQuery: UserQuery,
    private _userService: UsersService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this._userQuery.hasEntity()) {
      this._userService.getUsersList();
    }
    return of(true);
  }
}
