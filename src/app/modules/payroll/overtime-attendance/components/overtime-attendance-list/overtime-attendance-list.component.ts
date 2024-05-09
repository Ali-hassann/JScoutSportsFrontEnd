import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { EmployeeFilterRequest } from '../../../attendance/models/attendance.model';
import { OvertimeDetailResponse, OvertimeRequest, OvertimeResponse } from '../../models/overtime-attendance.model';
import { OvertimAttendanceService } from '../../services/overtim-attendance.service';
import { OvertimeAttendanceDetailComponent } from '../overtime-attendance-detail/overtime-attendance-detail.component';

@Component({
  selector: 'app-overtime-attendance-list',
  templateUrl: './overtime-attendance-list.component.html',
  styleUrls: ['./overtime-attendance-list.component.scss']
})
export class OvertimeOvertimeListComponent implements OnInit {

  public attendanceResponseList: OvertimeResponse[] = [];
  selectAll: boolean = false;
  statusId: number = 0;
  public attendanceRequest: EmployeeFilterRequest = new EmployeeFilterRequest();

  public display: boolean = false;
  public isDataLoading: boolean = false;
  attendanceForm: FormGroup | any;
  isShowAll = false;

  constructor(
    public _dialogService: DialogService,
    private _attendanceService: OvertimAttendanceService,
    private _authQuery: AuthQuery,
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private _breadcrumbService: AppBreadcrumbService,
  ) {
  }

  public ngOnInit(): void {
    this.buildForm();
    this.initialDataServiceCalls();
    this.setBreadCrumb();
  }

  private setBreadCrumb(): void {
    this._breadcrumbService.setBreadcrumbs([
      { label: 'Employee Overtime' },
    ]);
  }

  public saveOvertimeList(request: OvertimeRequest[]) {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait overtime is geting.', sticky: true });

    this._attendanceService.saveOvertimeAttendance(request).subscribe(res => {
      if (res) {
        this._messageService.clear();
        this._messageService.add(
          { severity: 'success', summary: 'Successful', detail: 'Overtime fetched successfully', life: 3000 }
        );
        this.selectAll = false;
        this.initialDataServiceCalls();
        
          // attendanceResponse.AttendanceId = res[0]?.OvertimeId;
          // this.addAttendanceDetailDialog(attendanceResponse);
        
      } else {
        this._messageService.clear();
        this.selectAll = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred. Please try again later.',
          life: 3000
        });
      }
    });
  }

  convertResponseToRequest(request: OvertimeResponse[], statusId: number, statusName: string): OvertimeRequest[] {
    let response: OvertimeRequest[] = [];
    request.forEach(c => {
      let req: OvertimeRequest = new OvertimeRequest();
      CommonHelperService.mapSourceObjToDestination(c, req);
      req.OrganizationId = this._authQuery.OrganizationId;
      req.OutletId = this._authQuery.PROFILE.CurrentOutletId;
      req.Remarks = statusName;
      req.MarkType = "User";
      response.push(req);
    });
    return response
  }

  getOvertimeList() {
    this.initialDataServiceCalls();
  }

  public initialDataServiceCalls(): void {
    CommonHelperService.assignFormValuesToObject(this.attendanceForm, this.attendanceRequest);
    this.attendanceRequest.FromDate = DateHelperService.getServerDateFormat(this.attendanceForm.controls["FromDate"].value);
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait overtime is geting.', sticky: true });
    this._attendanceService.getAttendanceOvertimeList(this.attendanceRequest).subscribe(res => {
      if (res.length > 0) {
        this._messageService.clear();
        this._messageService.add(
          { severity: 'success', summary: 'Successful', detail: 'Overtime fetched successfully', life: 3000 }
        );
        this.attendanceResponseList = res;
      } else {
        this._messageService.clear();
        this._messageService.add({
          severity: 'info',
          summary: 'Message',
          detail: 'Please change the filters.',
          life: 3000
        });
      }
    });
  }

  public addOvertimeDetailDialog(request: OvertimeResponse): void {
    let dialogRef = this._dialogService.open(OvertimeAttendanceDetailComponent, {
      header: 'Add Overtime Detail',
      data: request,
      width: '45%',
      height: '70%',
    });

    dialogRef.onClose.subscribe(
      isToRefresh => {
        if (isToRefresh) {
          this.getOvertimeList();
        }
      }
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  addOvertime() {
    this.isShowAll = !this.isShowAll;
  }

  private buildForm(): void {
    this.attendanceForm = this._formBuilder.group({
      OrganizationId: [this._authQuery.OrganizationId, [Validators.required]],
      OutletId: [this._authQuery.OutletId, [Validators.required]],
      FromDate: [DateHelperService.getServerDateFormat(), [Validators.required]],
      StatusIds: ['', [Validators.required]],
    });
  }
}
