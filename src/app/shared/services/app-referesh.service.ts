import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ConfigurationSettingService } from "src/app/modules/accounts/accounts-configuration/services/configuration-setting.service";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { CoaReferesherService } from "src/app/modules/accounts/charts-of-accounts/services/coa-referesher.service";
import { HeadCategoryQuery } from "src/app/modules/accounts/charts-of-accounts/states/data-state/head-category.query";
import { MeanHeadQuery as MainHeadQuery } from "src/app/modules/accounts/charts-of-accounts/states/data-state/main-head.query";
import { PostingAccountsQuery } from "src/app/modules/accounts/charts-of-accounts/states/data-state/posting-account.query";
import { SubCategoryQuery } from "src/app/modules/accounts/charts-of-accounts/states/data-state/sub-category.query";
import { UiChartOfAccountQuery } from "src/app/modules/accounts/charts-of-accounts/states/ui-state/ui-chart-of-account.query";
// import { AdminDashboardService } from "src/app/modules/dashboard/admin-dashboard/services/admin-dashboard.service";
// import { DashboardBranchesQuery } from "src/app/modules/dashboard/super-admin-dashboard/states/data-state/dashboard-branches-query";
import { VoucherQuery } from "src/app/modules/accounts/voucher/states/data-state/voucher-query";
import { UiVoucherQuery } from "src/app/modules/accounts/voucher/states/ui-state/ui-voucher.query";
import { OrganizationOutletsQuery } from "../states/branchs/institute-branches.query";
import { OrganizationOutletService } from "./data-services/institute-branches.service";
import { RightsService } from "src/app/modules/setting/rights/services/rights.service";
import { UsersService } from "src/app/modules/setting/users/services/users.service";
import { UserQuery } from "src/app/modules/setting/users/states/data-state/user-query";
import { UserRightsQuery } from "src/app/modules/setting/rights/states/user-rights.query";
import { ConfigurationSettingQuery } from "src/app/modules/accounts/accounts-configuration/states/data-states/accounts-configuration.query";

@Injectable({
    providedIn: "root",
})
export class AppRefereshService {
    constructor(
        private _voucherQuery: VoucherQuery,
        private _postingAccountsQuery: PostingAccountsQuery,
        private _subCategoryQuery: SubCategoryQuery,
        private _headCategoryQuery: HeadCategoryQuery,
        private _mainHeadQuery: MainHeadQuery,
        private _uiChartOfAccountQuery: UiChartOfAccountQuery,
        private _uiVoucherQuery: UiVoucherQuery,
        private _userQuery: UserQuery,
        private _userDataService: UsersService,
        private _configurationSettingQuery: ConfigurationSettingQuery,
        // private _dashboardBranchesQuery: DashboardBranchesQuery,
        private _instituteBranchesQuery: OrganizationOutletsQuery,
        private _userRightsService: RightsService,
        private _authQuery: AuthQuery,
        private _instituteBranchesService: OrganizationOutletService,
        private _accountsConfigurationService: ConfigurationSettingService,
        public _coaReferesher: CoaReferesherService,
        // private _adminDashboardService: AdminDashboardService,       
        private _router: Router,
        private _userRightsQuery: UserRightsQuery,
        private _rightsService: RightsService

    ) { }

    public ApplicationRefreshStores(clearBranches: boolean = true): void {
        this._voucherQuery.reset();
        this._postingAccountsQuery.reset();
        this._subCategoryQuery.reset();
        this._headCategoryQuery.reset();
        this._mainHeadQuery.reset();
        this._uiChartOfAccountQuery.reset();
        this._uiVoucherQuery.reset();
        this._userQuery.reset();
        this._configurationSettingQuery.reset();
        // this._dashboardBranchesQuery.reset();
        if (clearBranches) {
            this._instituteBranchesQuery.reset();
        }
    }

    fetchMasterData(fetchBranchesAndRights: boolean = true) {
        if (!this._instituteBranchesQuery.hasEntity()) {
            this._instituteBranchesService.getBranchList();
        }

        // this._userRightsService.getUserRights(this._authQuery?.PROFILE.Id);
        this._userDataService.getUsersList();

        // get account configuration
        // Getting Accounts Configuration if not Exists
        if (!this._configurationSettingQuery.hasEntity()) {
            this._accountsConfigurationService.getConfigurationSetting(this._authQuery.OutletId);
        }

        // getting all chart of account data
        this._coaReferesher.getChartOfAccountDataList();
        this.getUnpostedVoucherCount();
        if (!fetchBranchesAndRights) {
            let currentUrl = this._router.url;
            this._router.navigateByUrl('/shortwait', { skipLocationChange: true }).then(() => {
                this._router.navigateByUrl(currentUrl);
            });
        }
    }

    private getUnpostedVoucherCount(): void {
        // this._adminDashboardService
        //     .getUnpostedVoucherCount(
        //         this._authQuery.OrganizationId,
        //         this._authQuery.OutletId
        //     )
        //     .subscribe((count:any) => {
        //         this._uiVoucherQuery.setUnpostedVoucherCount(count);
        //     });
    }
}
