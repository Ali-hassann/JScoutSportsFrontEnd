import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AnnualLeaveRequest } from '../../models/annual-leave.model';
import { AnnualLeaveService } from '../../services/annual-leave.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';

@Component({
  selector: 'app-add-annual-leave',
  templateUrl: './add-annual-leave.component.html'
})
export class AddAnnualLeaveComponent implements OnInit {

  public annualLeavesRequest: AnnualLeaveRequest = new AnnualLeaveRequest()

  public leaveDate: Date = new Date();

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _annualLeavesService: AnnualLeaveService,
    public _configDialog: DynamicDialogConfig,
    private service: MessageService,
  ) {
    this.annualLeavesRequest = _configDialog?.data ?? new AnnualLeaveRequest();
    this.annualLeavesRequest.AnnualLeaveYear > 0 ? this.leaveDate = new Date(this.annualLeavesRequest.AnnualLeaveYear, 1, 1)
      : this.annualLeavesRequest.AnnualLeaveYear = this.leaveDate.getFullYear();
  }

  ngOnInit(): void {
  }

  public Close(isRefresh: boolean = false) {
    this._configDialogRef.close(isRefresh);
  }

  yearChanged() {
    this.annualLeavesRequest.AnnualLeaveYear = this.leaveDate.getFullYear();
  }

  public submit(f: NgForm) {
    if (!(f.invalid || this.annualLeavesRequest.AnnualLeaveYear == 0 || this.leaveDate.getFullYear() == 0)) {
      if (this.annualLeavesRequest?.AnnualLeaveId > 0) {
        this.UpdateAnnualLeave();
      }
      else {
        this.addAnnualLeave();
      }
    }
    else {
      this.service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addAnnualLeave() {
    this._annualLeavesService.addAnnualLeave(this.annualLeavesRequest).subscribe(
      (x: AnnualLeaveRequest) => {
        if (x) {
          this.service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close(true);
        }
        else {
          this.service.add({ severity: 'error', summary: 'Saved Sucessfully', detail: 'Something went wrong' });
        }
      }
    );
  }

  private UpdateAnnualLeave() {
    this._annualLeavesService.updateAnnualLeave(this.annualLeavesRequest).subscribe(
      (x: AnnualLeaveRequest) => {
        if (x) {
          this.service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close(true);
        }
      }
    );
  }
}
