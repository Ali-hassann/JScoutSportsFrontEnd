import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { AttendanceDetailResponse, AttendanceResponse } from '../../models/attendance.model';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.scss']
})
export class AttendanceDetailComponent implements OnInit {

  attendanceRequest: AttendanceResponse = new AttendanceResponse();
  attendanceResponseList: AttendanceDetailResponse[] = [];

  constructor(
    public _configDialog: DynamicDialogConfig,
    public _configDialogRef: DynamicDialogRef,
    private _attendanceService: AttendanceService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService,
  ) {
    this.attendanceRequest = _configDialog.data ?? new AttendanceResponse();
    this.attendanceRequest.DetailMarkType = this.attendanceRequest.MarkType;
  }

  ngOnInit(): void {
    this.getAttendanceDetailList();
  }

  getAttendanceDetailList() {
    this._attendanceService.getAttendanceDetailList(this.attendanceRequest.AttendanceId).subscribe(
      res => {
        this.attendanceResponseList = res;
      }
    );
  }

  saveAttendanceDetailList() {
    this.attendanceResponseList.forEach(s => {
      let timeString = "";

      if (s.CheckIn.toString().length > 8) {
        // if time change manuly
        timeString = s.CheckIn.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
        //
      } else {
        timeString = s.CheckIn;
      }

      // set date that is selected from date picker 
      // and then set time to that date
      const [time, meridian] = (timeString ?? "").split(' ');
      const [hours, minutes] = time.split(':');

      const checkIn = new Date(s.AttendanceDate);
      checkIn.setHours((Number(hours) + (meridian === 'PM' && Number(hours) !== 12 ? 12 : 0)));
      checkIn.setMinutes(Number(minutes));
      //

      s.CheckIn = DateHelperService.getServerDateTimeFormat(checkIn);
      let timeOutString = "";

      if (s.CheckOut?.toString()?.length > 8) {
        // if time change manuly
        timeOutString = s.CheckOut.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
        //
      } else {
        timeOutString = s.CheckOut;
      }

      if (timeOutString?.length > 0) {
        // set date that is selected from date picker 
        // and then set time to that date
        const [timeOut, meridianOut] = (timeOutString ?? "").split(' ');
        const [hoursOut, minutesOut] = timeOut.split(':');

        const checkout = new Date(s.AttendanceDate);
        checkout.setHours((Number(hoursOut) + (meridianOut === 'PM' && Number(hoursOut) !== 12 ? 12 : 0)));
        checkout.setMinutes(Number(minutesOut));
        //

        s.CheckOut = DateHelperService.getServerDateTimeFormat(checkout);
      }
    });

    this._attendanceService.saveAttendanceDetailList(this.attendanceResponseList).subscribe(
      res => {
        if (res) {
          this.Close(true);
        } else {
          this.Close();
        }
      }
    );
  }
  deleteSelected(selectedItem: AttendanceDetailResponse) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete attendance detail?',
      // key: 'overtime',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this._attendanceService.removeAttendanceDetail(selectedItem.AttendanceDetailId).subscribe(
          (data: boolean) => {
            if (data) {
              this.attendanceResponseList = this.attendanceResponseList.filter(item => item !== selectedItem);
              this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted Successfully', life: 3000 });
            }
            else {
              this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });

            }
          }
        )
      },
      reject: () => {
      }
      , key: "attendance"
    });

  }

  public Close(isToRefresh: boolean = false) {
    this._configDialogRef.close(isToRefresh);
  }

  addTime() {
    let inDateTime: any = new Date();
    inDateTime.setHours(8, 30, 0);
    inDateTime = inDateTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
    let outDateTime: any = new Date();
    outDateTime.setHours(17, 30, 0);
    outDateTime = outDateTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
    let attendanceDetail = new AttendanceDetailResponse();
    attendanceDetail.AttendanceId = this.attendanceRequest.AttendanceId;
    attendanceDetail.DetailMarkType = "User";
    attendanceDetail.CheckIn = inDateTime;
    attendanceDetail.CheckOut = outDateTime;
    attendanceDetail.EmployeeId = this.attendanceRequest.EmployeeId;
    attendanceDetail.AttendanceDate = this.attendanceRequest.AttendanceDate;
    attendanceDetail.AttendanceDetailId = 0;
    this.attendanceResponseList.push(attendanceDetail);
  }
}
