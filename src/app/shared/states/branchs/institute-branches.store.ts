import { Injectable } from "@angular/core";
import { EntityState, EntityStore, Store, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "../../enums/stores.enum";
import { OrganizationOutletRequest } from "../../models/organization-outlets.model";

export interface OrganizationOutletsState extends EntityState<OrganizationOutletRequest> { } {}

export function createInitialState(): OrganizationOutletsState {
    return {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: DATA_STORE_NAME.ORGANIZATIONOUTLETS, idKey: "OutletId" })
export class OrganizationOutletsStore extends EntityStore<OrganizationOutletsState> {
    constructor() {
        super(createInitialState());
    }
}
