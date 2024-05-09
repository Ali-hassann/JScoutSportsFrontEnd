import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { OrganizationProfile } from '../../models/institute-profile.model';
import { OrganizationProfileState, OrganizationProfileStore } from './institute-profile-store';

@Injectable({
    providedIn: 'root'
})

export class OrganizationProfileQuery extends QueryEntity<OrganizationProfileState, OrganizationProfile>
{
    constructor(
        protected _organizationProfileStore: OrganizationProfileStore
    ) {

        super(_organizationProfileStore);
    }

    organizationProfile$: Observable<OrganizationProfile> = this.select((state: any) => state.entities[state.ids[0]]);

    public get organizationProfile(): OrganizationProfile {
        return this.getAll()[0];
    }

    getImagePath() {
        return this.getAll().find(x => x)?.ImagePath;
    }

    getStartDate() {
        return this.getAll().find(x => x)?.StartDate;
    }

    getEndDate() {
        return this.getAll().find(x => x)?.EndDate;
    }
}