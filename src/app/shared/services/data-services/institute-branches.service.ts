import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { OrganizationOutletRequest } from "../../models/organization-outlets.model";
import { OrganizationOutletsQuery } from "../../states/branchs/institute-branches.query";

@Injectable({
    providedIn: "root",
})
export class OrganizationOutletService {
    constructor(
        private _http: HttpClient,
        private _instituteBranchesQuery: OrganizationOutletsQuery,
        private _authQuery: AuthQuery
    ) {}

    public getBranchList() {
        let url = `Organization/GetOutletList?organizationId=${this._authQuery.OrganizationId}`
        this._http
            .get<OrganizationOutletRequest[]>(url)
            .pipe(
                tap((data: OrganizationOutletRequest[]) => {
                    if (data?.length > 0) {
                        this._instituteBranchesQuery.addInstituteBranchList(data);
                    } else {
                        this._instituteBranchesQuery.addInstituteBranchList([]);
                    }
                })
            )
            .subscribe();
    }
}
