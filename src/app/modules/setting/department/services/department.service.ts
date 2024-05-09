import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DepartmentsRequest } from '../models/department.model';
import { DepartmentQuery } from '../states/departments.query';
import { DepartmentsStore } from '../states/departments.store';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(
    private _http: HttpClient,
    // private _departmentStore: DepartmentsStore,
    private _departmentQuery: DepartmentQuery,
    private _authQuery: AuthQuery,) {
  }

  getDepartmentList(instituteId: number = this._authQuery?.PROFILE.OrganizationId) {
    // this._http.get<DepartmentsRequestResponse[]>(`MasterData/GetDepartmentsList?instituteId=${instituteId}`).pipe(
    //   // this._toastService.observe({
    //   //     loading: "Fetching department list information....",
    //   //     success: `Got department list  successfully`,
    //   //     error: "Something went wrong while getting department list, please try again",
    //   // })
    // ).subscribe((data: DepartmentsRequestResponse[]) => {
    //   this._departmentStore.set(data);
    // }, error => { });
    this._departmentQuery.setLoading(true);
    this._http.get<DepartmentsRequest[]>(`CommonData/GetDepartmentsList?organizationId=${instituteId}`).subscribe(
      (data: DepartmentsRequest[]) => {
        if (data) {
          this._departmentQuery.setDepartmentList(data);
        }
        this._departmentQuery.setLoading(false);

      }
    )
  }

  updateDepartment(departmentResponse: DepartmentsRequest) {
    return this._http.post<DepartmentsRequest>(`CommonData/UpdateDepartment`, departmentResponse)
  }

  addDepartment(departmentResponse: DepartmentsRequest) {
    return this._http.post<DepartmentsRequest>(`CommonData/AddDepartment`, departmentResponse)
  }

  deleteDepartment(departmentsId: number) {
    return this._http.post<boolean>(`CommonData/RemoveDepartment?departmentsId=${departmentsId}`, null)
  }
}
