import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/modules/common/auth/models/auth.model';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { GlobalStore, GlobalState } from './global-state.store';

@Injectable({ providedIn: 'root' })
export class GlobalQuery extends Query<GlobalState> {
  selectedGlobalOutletId$: Observable<number>;
  constructor(
    protected _store: GlobalStore,
    protected _authQuery: AuthQuery,
  ) {
    super(_store);
    this.selectedGlobalOutletId$ = this.select(x => x.SelectedOutletId);
  }

  public setGlobalBranch(OutletId: number): void {
    this._authQuery.setCurrentBranch(OutletId);
    //this._authQuery.OutletId=OutletId;
    const profile = JSON.parse(localStorage.getItem('currentlogin') ?? "") as UserProfile;
    profile.CurrentOutletId = OutletId;
    profile.OutletId = OutletId;
    this._authQuery.SetProfile(profile);
    localStorage.removeItem('currentlogin');
    localStorage.setItem('currentlogin', JSON.stringify(profile));
  }

}


