import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AllowanceTypeRequest } from '../models/allowance-type.model';
import { AllowanceTypeQuery } from '../states/allowance-types.query';

@Injectable({
  providedIn: 'root'
})
export class AllowanceTypeService {

  constructor(
    private _http: HttpClient,
    private _authQuery: AuthQuery,
    private _allowanceTypeQuery: AllowanceTypeQuery
  ) {
  }

  getAllowanceTypeList() {
    this._allowanceTypeQuery.setLoading(true);
    this._http.get<AllowanceTypeRequest[]>(`CommonData/GetAllowanceTypeList?organizationId=${this._authQuery.PROFILE.OrganizationId}&outletId=${this._authQuery.PROFILE.OutletId}`).subscribe(
      (data: AllowanceTypeRequest[]) => {
        if (data) {
          this._allowanceTypeQuery.setAllowanceTypeList(data);
        }
        this._allowanceTypeQuery.setLoading(false);
      }
    )
  }

  addAllowanceType(employeeBenefitType: AllowanceTypeRequest): Observable<AllowanceTypeRequest> {
    return this._http.post(`CommonData/AddAllowanceType`, employeeBenefitType) as Observable<AllowanceTypeRequest>;
  }

  updateAllowanceType(employeeBenefitType: AllowanceTypeRequest): Observable<AllowanceTypeRequest> {
    return this._http.post(`CommonData/UpdateAllowanceType`, employeeBenefitType) as Observable<AllowanceTypeRequest>;
  }
  
  removeAllowanceType(BenefitTypeId: number): Observable<boolean> {
    return this._http.post(`CommonData/RemoveAllowanceType?allowanceTypeId=${BenefitTypeId}`, null) as Observable<boolean>;
  }
}
