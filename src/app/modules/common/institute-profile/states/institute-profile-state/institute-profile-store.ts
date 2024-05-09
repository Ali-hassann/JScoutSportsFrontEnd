import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { DATA_STORE_NAME } from "src/app/shared/enums/stores.enum";
import { OrganizationProfile } from "../../models/institute-profile.model";

export interface OrganizationProfileState extends EntityState<OrganizationProfile> { }

export function createState() {
    return {};
}

@Injectable({ providedIn: 'root' })
@StoreConfig({
    name: DATA_STORE_NAME.ORGANIZATIONPROFILE,
    idKey: "OrganizationId"
})

export class OrganizationProfileStore extends EntityStore<OrganizationProfileState, OrganizationProfile> {

    constructor() {
        super(createState());
    }
}