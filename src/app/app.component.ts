import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { CoaReferesherService } from './modules/accounts/charts-of-accounts/services/coa-referesher.service';
import { UserProfile } from './modules/common/auth/models/auth.model';
import { AuthQuery } from './modules/common/auth/states/auth.query';
import { AuthStore } from './modules/common/auth/states/auth.store';
import { RightsService } from './modules/setting/rights/services/rights.service';
import { UserRightsQuery } from './modules/setting/rights/states/user-rights.query';
import { AppRefereshService } from './shared/services/app-referesh.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig,
        private _authQuery: AuthQuery,
        private _authStore: AuthStore,
        public _router: Router,
        public _coaReferesher: CoaReferesherService,
        public _userRightsService: RightsService,
        public _userRightsQuery: UserRightsQuery,
        private router: Router,
        private _appRefereshService: AppRefereshService) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        // this.onModuleLoading();
        if (!this._authQuery.hasEntity()) {
            const user = localStorage.getItem('currentlogin');
            if (user) {
                const profile: UserProfile = JSON.parse(user);
                if (profile && profile.OrganizationProfile) {
                    this._authStore.set([profile]);

                    // this._userRightsService.getUserRights(profile.Id, true);

                    if (window.location.pathname === '/' && window.location.hash === '#/') {
                        this._userRightsService.getUserRights(profile.Id, true);
                    } else {
                        this._userRightsService.getUserRights(profile.Id, false);
                        this._appRefereshService.ApplicationRefreshStores();
                        this._appRefereshService.fetchMasterData();
                    }
                }
            }
        }
    }
}
