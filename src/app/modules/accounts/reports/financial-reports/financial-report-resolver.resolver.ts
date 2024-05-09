import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { GenericBaseModel } from 'src/app/shared/models/base.model';
import { PostingAccountsService } from '../../charts-of-accounts/services/posting-accounts.service';
import { PostingAccountsQuery } from '../../charts-of-accounts/states/data-state/posting-account.query';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportResolverResolver implements Resolve<boolean> {

  constructor(
    private _postingAccountsQuery: PostingAccountsQuery,
    private _postingAccountsService: PostingAccountsService,
    private _authService: AuthQuery
  ) {

  }
  resolve(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
    if (!this._postingAccountsQuery.hasEntity()) {
      this.getPostingAccounts();
    }
    else {
      this._postingAccountsQuery.reset();
      this.getPostingAccounts()
    }
    return of(true);
  }


  getPostingAccounts() {
    this._postingAccountsService.getPostingAccountList(this._authService.PROFILE.CurrentOutletId);
  }
}
