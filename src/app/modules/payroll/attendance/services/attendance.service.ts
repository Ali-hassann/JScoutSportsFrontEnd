import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AttendanceDetailResponse, AttendanceRequest, AttendanceResponse, EmployeeFilterRequest } from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private _http: HttpClient) { }

  public getAttendanceList(request: EmployeeFilterRequest): Observable<AttendanceResponse[]> {
    let url = "Attendance/GetAttendanceList";
    return this._http.post<AttendanceResponse[]>(url, request) as Observable<AttendanceResponse[]>;
  }

  public saveAttendance(request: AttendanceRequest[]): Observable<AttendanceRequest[]> {
    let url = "Attendance/SaveAttendance";
    return this._http.post<AttendanceRequest[]>(url, request) as Observable<AttendanceRequest[]>;
  }

  public saveAttendanceDetailList(request: AttendanceDetailResponse[]): Observable<boolean> {
    let url = "Attendance/SaveAttendanceDetailList";
    return this._http.post<boolean>(url, request) as Observable<boolean>;
  }

  public getAttendanceDetailList(attendanceId: number): Observable<AttendanceDetailResponse[]> {
    let url = `Attendance/GetAttendanceDetailList?attendanceId=${attendanceId}`;
    return this._http.get<AttendanceDetailResponse[]>(url) as Observable<AttendanceDetailResponse[]>;
  }
  public removeAttendanceDetail(detailId: number): Observable<boolean> {
    let url = `Attendance/RemoveAttendanceDetail?attendanceDetailId=${detailId}`;
    return this._http.post<boolean>(url, null) as Observable<boolean>;
  }
}
