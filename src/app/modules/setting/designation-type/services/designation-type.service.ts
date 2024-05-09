import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DesignationRequestResponse } from '../models/benefit-type.model';
import { DesignationTypeQuery } from '../states/designation-type.query';

@Injectable({
  providedIn: 'root'
})
export class DesignationTypeService {

  constructor(
    private _http: HttpClient,
    private _authQuery: AuthQuery,
    private _designationTypeQuery: DesignationTypeQuery
  ) {
  }
  getDesignationTypeList() {
    this._designationTypeQuery.setLoading(true);
    this._http.get<DesignationRequestResponse[]>(`CommonData/GetDesignationList?organizationId=${this._authQuery.PROFILE.OrganizationId}`).subscribe(
      (data: DesignationRequestResponse[]) => {
        if (data) {
          this._designationTypeQuery.setDesignationTypeList(data);
        }
        this._designationTypeQuery.setLoading(false);

      }
    )
  }

  addDesignationType(designation: DesignationRequestResponse) {
    return this._http.post<DesignationRequestResponse>(`CommonData/AddDesignation`, designation);
  }
  updateDesignationType(designation: DesignationRequestResponse) {
    return this._http.post<DesignationRequestResponse>(`CommonData/UpdateDesignation`, designation);
  }
  removeDesignationType(designationId: number) {
    return this._http.post<boolean>(`CommonData/RemoveDesignation?designationId=${designationId}`, null);

  }
}
