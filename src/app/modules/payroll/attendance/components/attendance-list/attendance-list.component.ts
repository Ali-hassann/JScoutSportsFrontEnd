import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { COA } from 'src/app/shared/enums/rights.enum';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { AttendanceRequest, AttendanceResponse, EmployeeFilterRequest } from '../../models/attendance.model';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceDetailComponent } from '../attendance-detail/attendance-detail.component';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {
  public attendanceResponseList: AttendanceResponse[] = [];
  selectAll: boolean = false;
  isToShowUpdateIcon: boolean = false;
  statusId: number = 0;
  public attendanceRequest: EmployeeFilterRequest = new EmployeeFilterRequest();

  public display: boolean = false;
  public isDataLoading: boolean = false;
  attendanceForm: FormGroup | any;
  cols: any[] = [
    { field: 'Name', header: 'Name' },
    { field: 'MainHeadsName', header: 'Main Head' },
  ];

  COA = COA;
  attendanceStatus: any[] = [
    { Name: "Present", Id: 1 },
    { Name: "Absent", Id: 4 },
    { Name: "Leave Paid", Id: 2 },
    { Name: "Leave UnPaid", Id: 3 },
    { Name: "HalfLeave", Id: 5 }
  ];

  constructor(
    public _dialogService: DialogService,
    private _attendanceService: AttendanceService,
    private _authQuery: AuthQuery,
    private _confirmationService: ConfirmationService,
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
      { label: 'Employee Attendance' },
    ]);
  }

  onSelectAllChange(event: any) {
    this.attendanceResponseList.forEach(x => x.Selected = event.checked);
    this.isToShowUpdateIcon = event.checked;
    this.isToShowUpdateIcon = this.attendanceResponseList.findIndex(f => (f.Selected ?? false) == true) >= 0 ? true : false;
  }

  onSingleSelectChange(event: any) {
    if (event.checked) {
      this.isToShowUpdateIcon = event.checked;
      this.isToShowUpdateIcon = this.attendanceResponseList.findIndex(f => (f.Selected ?? false) == true) >= 0 ? true : false;
      this.selectAll = this.attendanceResponseList.findIndex(c => (c.Selected ?? false) == false) >= 0 ? false : true;
    } else {
      this.isToShowUpdateIcon = event.checked;
      this.selectAll = event.checked;
    }
  }

  selectAllRowSelect(event: any) {
    let selectedAttendance: AttendanceResponse[] = [];
    this.attendanceResponseList.map(d => {
      if (d.Selected) { selectedAttendance.push(d); }
    });
    let request = this.convertResponseToRequest(selectedAttendance, event.data.Id, event.data.Name);
    this.saveAttendanceList(request);
  }

  onRowSelect(event: any, attendanceData: AttendanceResponse) {
    let request = this.convertResponseToRequest([attendanceData], event.data.Id, event.data.Name);
    this.saveAttendanceSingle(request, attendanceData);
    // this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
  }

  private saveAttendanceSingle(request: AttendanceRequest[], attendanceResponse: AttendanceResponse) {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait attendance is geting.', sticky: true });

    this._attendanceService.saveAttendance(request).subscribe(res => {
      if (res?.length > 0) {
        this._messageService.clear();
        this._messageService.add(
          { severity: 'success', summary: 'Successful', detail: '"Attendance status', life: 3000 }
        );
        this.isToShowUpdateIcon = false;
        this.selectAll = false;
        this.initialDataServiceCalls();
        if (request[0].AttendanceStatusId == 1 || request[0].AttendanceStatusId == 5) {
          attendanceResponse.AttendanceId = res[0]?.AttendanceId;
          this.addAttendanceDetailDialog(attendanceResponse);
        }
      } else {
        this._messageService.clear();
        this.isToShowUpdateIcon = false;
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

  private saveAttendanceList(request: AttendanceRequest[]) {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait attendance is geting.', sticky: true });

    this._attendanceService.saveAttendance(request).subscribe(res => {
      if (res) {
        this._messageService.clear();
        this._messageService.add(
          { severity: 'success', summary: 'Successful', detail: '"Attendance status', life: 3000 }
        );
        this.isToShowUpdateIcon = false;
        this.selectAll = false;
        this.initialDataServiceCalls();
      } else {
        this._messageService.clear();
        this.isToShowUpdateIcon = false;
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

  convertResponseToRequest(request: AttendanceResponse[], statusId: number, statusName: string): AttendanceRequest[] {
    let response: AttendanceRequest[] = [];
    request.forEach(c => {
      let req: AttendanceRequest = new AttendanceRequest();
      CommonHelperService.mapSourceObjToDestination(c, req);
      req.AttendanceStatusId = statusId;
      req.OrganizationId = this._authQuery.OrganizationId;
      req.OutletId = this._authQuery.PROFILE.CurrentOutletId;
      req.Remarks = statusName;
      req.MarkType = "User";
      response.push(req);
    });
    return response
  }

  getAttendanceList() {
    this.initialDataServiceCalls();
  }

  public initialDataServiceCalls(): void {
    CommonHelperService.assignFormValuesToObject(this.attendanceForm, this.attendanceRequest);
    this.attendanceRequest.FromDate = DateHelperService.getServerDateFormat(this.attendanceForm.controls["FromDate"].value);
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait attendance is being fetched.', sticky: true });

    this._attendanceService.getAttendanceList(this.attendanceRequest).subscribe(res => {
      if (res.length > 0) {
        this._messageService.clear();

        this._messageService.add(
          { severity: 'success', summary: 'Successful', detail: 'Attendance fetched successfully', life: 3000 }
        );

        this.attendanceResponseList = res;
      } else {
        this._messageService.clear();
        this._messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Please change the filters .',
          life: 3000
        });
      }
    });
  }

  public addAttendanceDetailDialog(request: AttendanceResponse): void {
    let dialogRef = this._dialogService.open(AttendanceDetailComponent, {
      header: 'Add Attendance Detail',
      data: request,
      width: '45%',
      height: '70%',
    });

    dialogRef.onClose.subscribe(
      isToRefresh => {
        if (isToRefresh) {
          this.getAttendanceList();
        }
      }
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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