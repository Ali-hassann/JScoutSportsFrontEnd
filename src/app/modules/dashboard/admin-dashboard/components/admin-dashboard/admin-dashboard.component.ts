import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  public currentdate = new Date();
  public LastDay = new Date();
  public LastWeek = new Date();
  public LastMonth = new Date();
  public LastYear = new Date();
  public recordDuration: any[] = [];
  public unpostedVoucherCount$: Observable<number> | any;
  public selectedDuration: FormControl = new FormControl();
  constructor(
    // private breadcrumbService: AppBreadcrumbService  ,
    // private _uiVoucherQuery: UiVoucherQuery,
  ) {
  }

  ngOnInit(): void {
    this.setBreadCrumb();
    this.onDurationChange();
    this.initialDataBinding();
  }

  public onDurationChange(): void {
    this.selectedDuration.valueChanges.subscribe(duration => {

    })
  }
  public initialDataBinding(): void {
    this.LastDay.setDate(this.LastDay.getDate() - 1);
    this.LastWeek.setDate(this.LastWeek.getDate() - 7);
    this.LastMonth.setMonth(this.LastMonth.getMonth() - 1);
    this.LastYear.setFullYear(this.LastYear.getFullYear() - 1);
    this.recordDuration = [
      { duration: 'Last Day', code: DateHelperService.getServerDateFormat(this.LastDay) },
      { duration: 'Last Week', code: DateHelperService.getServerDateFormat(this.LastWeek) },
      { duration: 'Last Month', code: DateHelperService.getServerDateFormat(this.LastMonth) },
      { duration: 'Last Year', code: DateHelperService.getServerDateFormat(this.LastYear) },
    ];
    this.selectedDuration.setValue(DateHelperService.getServerDateFormat(this.LastYear));
    // this.unpostedVoucherCount$ = this._uiVoucherQuery.uiUnpostedVoucher$;
  }

  private setBreadCrumb(): void {
    // this.breadcrumbService.setItems([
    //   { label: 'Dashboard' }
    // ], true);
  }
}
