import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { GazettedHolidayRequest } from '../models/gazetted-holiday.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GazettedHolidayService {
  constructor(
    private _http: HttpClient,
    private _authQuery: AuthQuery,) {
  }

  public getGazettedHolidayList(): Observable<GazettedHolidayRequest[]> {
    return this._http.get<GazettedHolidayRequest[]>(`Attendance/GetGazettedHolidayList`) as Observable<GazettedHolidayRequest[]>;
  }

  updateGazettedHoliday(gazettedHolidayRequest: GazettedHolidayRequest) {
    return this._http.post<GazettedHolidayRequest>(`Attendance/UpdateGazettedHoliday`, gazettedHolidayRequest)
  }

  addGazettedHoliday(gazettedHolidayRequest: GazettedHolidayRequest) {
    return this._http.post<GazettedHolidayRequest>(`Attendance/AddGazettedHoliday`, gazettedHolidayRequest)
  }

  deleteGazettedHoliday(gazettedHolidayId: number) {
    return this._http.post<boolean>(`Attendance/RemoveGazettedHoliday?gazettedHolidayId=${gazettedHolidayId}`, null)
  }
}
