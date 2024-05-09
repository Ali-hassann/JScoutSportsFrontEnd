import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AnnualLeaveRequest } from '../models/annual-leave.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnualLeaveService {
  constructor(
    private _http: HttpClient,
    private _authQuery: AuthQuery,) {
  }

  public getAnnualLeaveList(): Observable<AnnualLeaveRequest[]> {
    return this._http.get<AnnualLeaveRequest[]>(`Attendance/GetAnnualLeaveList`) as Observable<AnnualLeaveRequest[]>;
  }

  updateAnnualLeave(gazettedHolidayRequest: AnnualLeaveRequest) {
    return this._http.post<AnnualLeaveRequest>(`Attendance/UpdateAnnualLeave`, gazettedHolidayRequest)
  }

  addAnnualLeave(gazettedHolidayRequest: AnnualLeaveRequest) {
    return this._http.post<AnnualLeaveRequest>(`Attendance/AddAnnualLeave`, gazettedHolidayRequest)
  }

  deleteAnnualLeave(gazettedHolidayId: number) {
    return this._http.post<boolean>(`Attendance/RemoveAnnualLeave?gazettedHolidayId=${gazettedHolidayId}`, null)
  }
}
