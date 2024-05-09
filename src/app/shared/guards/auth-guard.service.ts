import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authQuery: AuthQuery) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authQuery.IS_LOGGED_IN) {
      return true;
    }
    else {
      return false;
    }
  }
}
