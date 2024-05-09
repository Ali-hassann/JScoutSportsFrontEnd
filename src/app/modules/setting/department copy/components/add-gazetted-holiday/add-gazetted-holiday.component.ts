import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { GazettedHolidayRequest } from '../../models/gazetted-holiday.model';
import { GazettedHolidayService } from '../../services/gazetted-holiday.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';

@Component({
  selector: 'app-add-gazetted-holiday',
  templateUrl: './add-gazetted-holiday.component.html'
})
export class AddGazettedHolidayComponent implements OnInit {

  public gazettedHolidayRequest: GazettedHolidayRequest = new GazettedHolidayRequest()

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _gazettedHolidayService: GazettedHolidayService,
    public _configDialog: DynamicDialogConfig,
    private service: MessageService,

  ) {
    this.gazettedHolidayRequest = _configDialog?.data ?? new GazettedHolidayRequest();
  }

  ngOnInit(): void {
  }

  public Close(isRefresh: boolean = false) {
    this._configDialogRef.close(isRefresh);
  }

  public submit(f: NgForm) {
    if (!(f.invalid)) {
      this.gazettedHolidayRequest.GazettedHolidayDate = DateHelperService.getServerDateFormat(this.gazettedHolidayRequest.GazettedHolidayDate);
      if (this.gazettedHolidayRequest?.GazettedHolidayId > 0) {
        this.UpdateGazettedHoliday();
      }
      else {
        this.addGazettedHoliday();
      }
    }
    else {
      this.service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addGazettedHoliday() {
    this._gazettedHolidayService.addGazettedHoliday(this.gazettedHolidayRequest).subscribe(
      (x: GazettedHolidayRequest) => {
        if (x) {
          this.service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close(true);
        }
        else {
          this.service.add({ severity: 'error', summary: 'Saved Sucessfully', detail: 'Something went wrong' });
        }
      }
    )
  }

  private UpdateGazettedHoliday() {
    this._gazettedHolidayService.updateGazettedHoliday(this.gazettedHolidayRequest).subscribe(
      (x: GazettedHolidayRequest) => {
        if (x) {
          this.service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close(true);
        }
      }
    )
  }
}
