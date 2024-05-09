import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { UserRightsQuery } from 'src/app/modules/setting/rights/states/user-rights.query';

@Component({
  selector: 'app-short-wait-for-rights',
  templateUrl: './short-wait-for-rights.component.html'
})
export class ShortWaitForRightsComponent implements OnInit {
  rightsSubscription: Subscription = new Subscription();
  constructor(
    private _userRightsQuery: UserRightsQuery,
    private _router: Router,
    private _authQuery: AuthQuery,
  ) { }

  ngOnInit(): void {
    this.rightsSubscription.unsubscribe();
    this.getRightsAndNavigate()
  }

  getRightsAndNavigate() {
    this.rightsSubscription = this._userRightsQuery
      .selectCount()
      .subscribe((count: number) => {
        if (count > 0) {
          this.rightsSubscription?.unsubscribe();
          window.history.back();
        } else {
          this.rightsSubscription?.unsubscribe();
          this._authQuery.logOut();
        }
      });
  }
}
