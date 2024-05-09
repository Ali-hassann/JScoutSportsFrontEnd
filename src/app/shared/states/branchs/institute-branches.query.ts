import { Injectable } from "@angular/core";
import { Query, QueryEntity, transaction } from "@datorama/akita";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { OrganizationOutletRequest } from "../../models/organization-outlets.model";
import {
    OrganizationOutletsStore,
    OrganizationOutletsState,
} from "./institute-branches.store";

@Injectable({ providedIn: "root" })
export class OrganizationOutletsQuery extends QueryEntity<OrganizationOutletsState> {
    instituteBranchList$: Observable<OrganizationOutletsState>;
    constructor(
        protected _store: OrganizationOutletsStore,
        protected _authQuery: AuthQuery
    ) {
        super(_store);
        this.instituteBranchList$ = this.selectAll() as Observable<
            OrganizationOutletRequest[]
        >;
    }

    public reset(): void {
        this._store.reset();
    }

    public getBranchById(brnchId: number) {
        return this.getEntity(brnchId);
    }
    @transaction()
    public addInstituteBranchList(entity: OrganizationOutletRequest[]): void {
        this._store.setLoading(false);
        this._store.add(entity);
    }
}
