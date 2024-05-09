import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { OvertimeDetailResponse, OvertimeRequest } from '../../models/overtime-attendance.model';
import { OvertimAttendanceService } from '../../services/overtim-attendance.service';

@Component({
  selector: 'app-overtime-attendance-detail',
  templateUrl: './overtime-attendance-detail.component.html',
  styleUrls: ['./overtime-attendance-detail.component.scss']
})
export class OvertimeAttendanceDetailComponent implements OnInit {

  attendanceRequest: OvertimeRequest = new OvertimeRequest();
  attendanceResponseList: OvertimeDetailResponse[] = [];

  constructor(
    public _configDialog: DynamicDialogConfig,
    public _configDialogRef: DynamicDialogRef,
    private _attendanceService: OvertimAttendanceService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService,
  ) {
    this.attendanceRequest = _configDialog.data ?? new OvertimeRequest();
    this.attendanceRequest.MarkType = this.attendanceRequest.MarkType;
  }

  ngOnInit(): void {
    this.getAttendanceDetailList();
  }

  getAttendanceDetailList() {
    this._attendanceService.getOvertimeAttendanceDetailList(this.attendanceRequest.OvertimeId).subscribe(
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

      const checkIn = new Date(s.OvertimeDate);
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

        const checkout = new Date(s.OvertimeDate);
        checkout.setHours((Number(hoursOut) + (meridianOut === 'PM' && Number(hoursOut) !== 12 ? 12 : 0)));
        checkout.setMinutes(Number(minutesOut));
        //

        s.CheckOut = DateHelperService.getServerDateTimeFormat(checkout);
      }
    });

    this._attendanceService.saveOvertimeAttendanceDetailList(this.attendanceResponseList).subscribe(
      res => {
        if (res) {
          this.Close(true);
        } else {
          this.Close();
        }
      }
    );
  }

  public Close(isToRefresh: boolean = false) {
    this._configDialogRef.close(isToRefresh);
  }

  deleteSelected(selectedItem: OvertimeDetailResponse) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete overtime detail?',
      // key: 'overtime',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._attendanceService.removeOvertimeAttendanceDetail(selectedItem.OvertimeDetailId).subscribe(
          (data: boolean) => {
            if (data) {
              this.attendanceResponseList = this.attendanceResponseList.filter(item => item !== selectedItem);
              this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted Successfully', life: 3000 });
            }
            else {
              this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });

            }
          }
        );
      },
      reject: () => {
      }
      , key: "overtime"
    });

  }


  addTime() {
    let inDateTime: any = new Date();
    inDateTime.setHours(17, 31, 0);
    inDateTime = inDateTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });

    let attendanceDetail = new OvertimeDetailResponse();
    attendanceDetail.OvertimeId = this.attendanceRequest.OvertimeId;
    attendanceDetail.DetailMarkType = "User";
    attendanceDetail.CheckIn = inDateTime;
    attendanceDetail.EmployeeId = this.attendanceRequest.EmployeeId;
    attendanceDetail.OvertimeDate = this.attendanceRequest.OvertimeDate;
    attendanceDetail.OvertimeDetailId = 0;
    this.attendanceResponseList.push(attendanceDetail);
  }

}
