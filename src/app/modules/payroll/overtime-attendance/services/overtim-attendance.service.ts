import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeFilterRequest } from '../../attendance/models/attendance.model';
import { OvertimeDetailResponse, OvertimeRequest, OvertimeResponse } from '../models/overtime-attendance.model';

@Injectable({
  providedIn: 'root'
})
export class OvertimAttendanceService {

  constructor(private _http: HttpClient) { }

  public getAttendanceOvertimeList(request: EmployeeFilterRequest): Observable<OvertimeResponse[]> {
    let url = "Attendance/GetOvertimeList";
    return this._http.post<OvertimeResponse[]>(url, request) as Observable<OvertimeResponse[]>;
  }

  public saveOvertimeAttendance(request: OvertimeRequest[]): Observable<boolean> {
    let url = "Attendance/SaveOvertime";
    return this._http.post<boolean>(url, request) as Observable<boolean>;
  }

  public saveOvertimeAttendanceDetailList(request: OvertimeDetailResponse[]): Observable<boolean> {
    let url = "Attendance/SaveOvertimeDetailList";
    return this._http.post<boolean>(url, request) as Observable<boolean>;
  }

  public removeOvertimeAttendanceDetail(detailId: number): Observable<boolean> {
    let url = `Attendance/RemoveOvertimeDetail?overtimeDetailId=${detailId}`;
    return this._http.post<boolean>(url, null) as Observable<boolean>;
  }

  public getOvertimeAttendanceDetailList(attendanceId: number): Observable<OvertimeDetailResponse[]> {
    let url = `Attendance/GetOvertimeDetailList?OvertimeId=${attendanceId}`;
    return this._http.get<OvertimeDetailResponse[]>(url) as Observable<OvertimeDetailResponse[]>;
  }
}
