import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganizationRoleRequest, OrgRoleRightsRequest, OrgRoleRightsResponse } from '../models/organization-role.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationRoleService {

  constructor(
    private _http: HttpClient
  ) { }

  public addOrganizationRole(role: OrganizationRoleRequest): Observable<OrganizationRoleRequest> {
    return this._http.post<OrganizationRoleRequest>(`RoleRights/AddOrganizationRole`, role) as Observable<OrganizationRoleRequest>;
  }
  public updateOrganizationRole(role: OrganizationRoleRequest): Observable<OrganizationRoleRequest> {
    return this._http.post<OrganizationRoleRequest>(`RoleRights/UpdateOrganizationRole`, role) as Observable<OrganizationRoleRequest>;
  }
  public getOrganizationRoleList(organizationId: number): Observable<OrganizationRoleRequest[]> {
    return this._http.get<OrganizationRoleRequest[]>(`RoleRights/GetOrganizationRoleList?OrganizationId=${organizationId}`) as Observable<OrganizationRoleRequest[]>;
  }
  public getOrgRoleRightsList(organizationId: number, organizationRoleId: number): Observable<OrgRoleRightsResponse[]> {
    return this._http.get<OrgRoleRightsResponse[]>(`RoleRights/GetOrgRoleRightsList?OrganizationId=${organizationId}&OrganizationRoleId=${organizationRoleId}`) as Observable<OrgRoleRightsResponse[]>;
  }
  public addRightsToOrganizationRoles(roleRights: OrgRoleRightsRequest[]): Observable<OrganizationRoleRequest> {
    return this._http.post<OrganizationRoleRequest>(`RoleRights/AddRightsToOrganizationRoles`, roleRights) as Observable<OrganizationRoleRequest>;
  }
  public updateRightsToOrganizationRoles(roleRights: OrgRoleRightsRequest[]): Observable<OrganizationRoleRequest> {
    return this._http.post<OrganizationRoleRequest>(`RoleRights/UpdateRightsToOrganizationRoles`, roleRights) as Observable<OrganizationRoleRequest>;
  }
}
