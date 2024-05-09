import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
// import { AppBreadcrumbService } from 'src/app/application/components/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AccountHeadsFilterRequest } from 'src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model';
import { HeadCategorysResponse } from 'src/app/modules/accounts/charts-of-accounts/models/head-category.model';
import { HeadCategoryQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/head-category.query';
import { UiVoucherQuery } from 'src/app/modules/accounts/voucher/states/ui-state/ui-voucher.query';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { environment } from 'src/environments/environment';
import { HeadCategoryListResponse, PrintHeadCategoryReportsRequest } from '../../models/head-category-reports.model';
import { HeadCategoryReportsService } from '../../services/head-category-reports.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-head-category-reports',
  templateUrl: './head-category-reports.component.html',
  styleUrls: ['./head-category-reports.component.scss']
})
export class HeadCategoryReportsComponent implements OnInit {

  public headCategoryList: HeadCategorysResponse[] = [];
  public HeadCategoryReportsList$: Observable<HeadCategoryListResponse[]> | any;
  public headCategoryReportsForm: FormGroup | any;
  public SearchText: string = '';
  public isDataLoading$: Observable<boolean> = of(false);
  public headCategoryyReportRequest: PrintHeadCategoryReportsRequest = new PrintHeadCategoryReportsRequest();
  public unpostedVoucherCount$: Observable<number>;

  constructor(
    private _authQuery: AuthQuery,
    private _headCategoryReportsService: HeadCategoryReportsService,
    private _headCategoryQuery: HeadCategoryQuery,
    private _fb: FormBuilder,
    private _dval: DomainValidatorsService,
    // private _breadCrumbService: AppBreadcrumbService,
    private _uiVoucherQuery: UiVoucherQuery,
    private _messageService: MessageService,
  ) {
    this.buildForm();
    this._headCategoryQuery.headCategoryList$.subscribe(
      (x: any) => {
        this.headCategoryList = x
      }
    );
    this.unpostedVoucherCount$ = this._uiVoucherQuery.uiUnpostedVoucher$;
  }

  ngOnInit(): void {
    this.initialDataServiceCalls();
    this.setBreadCrumb();
  }

  public setBreadCrumb(): void {
    // this._breadCrumbService.setItems([
    //   { label: 'Reports' },
    //   { label: 'Head Category' },
    // ]);
  }

  public printVoucher() {
    if (this.headCategoryReportsForm.invalid) {
      this.headCategoryReportsForm.markAllAsTouched();
      return
    }
    let printHeadCategoryReportsRequest = new PrintHeadCategoryReportsRequest();
    this._dval.assignFormValuesToObject(this.headCategoryReportsForm, printHeadCategoryReportsRequest);
    printHeadCategoryReportsRequest.FromDate = DateHelperService.getServerDateFormat(printHeadCategoryReportsRequest.FromDate);
    printHeadCategoryReportsRequest.ToDate = DateHelperService.getServerDateFormat(printHeadCategoryReportsRequest.ToDate);
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._headCategoryReportsService.printHeadCategoryReports(printHeadCategoryReportsRequest).pipe(
      map((response: any) => {
        if (response) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });
          let blob: Blob = response.body as Blob;
          let frame = document.getElementById("frame") as HTMLIFrameElement;
          frame.src = window.URL.createObjectURL(blob);

        }
        else {
          this._messageService.clear();
          this._messageService.add({ severity: 'info', summary: 'Info', detail: 'No record found for selected criteria', sticky: true });

        }
      })
    ).subscribe();
  }

  public initialDataServiceCalls(): void {
    if (!this._headCategoryQuery.hasEntity()) {
      let filterModal: AccountHeadsFilterRequest = new AccountHeadsFilterRequest();
      filterModal.OrganizationId = this._authQuery.OrganizationId;
      filterModal.OutletId = this._authQuery.OutletId;
    }
  }

  public CheckDate(control: AbstractControl | any): void {

    const FromDate = control.get("FromDate").value;
    const ToDate = control.get("ToDate").value;
    if (FromDate > ToDate) {
      control.get("ToDate").setErrors({ ToDate: true });
    }
    else {
      control.get("ToDate").setErrors(null);
    }
  }

  private buildForm(): void {
    this.headCategoryReportsForm = this._fb.group({
      OrganizationId: [this._authQuery.OrganizationId, [Validators.required]],
      OutletId: [this._authQuery.OutletId, [Validators.required]],
      HeadCategoriesId: [0, [Validators.required, Validators.min(1)]],
      FromDate: [new Date(), [Validators.required]],
      ToDate: [new Date(), [Validators.required]],
      IncludeDetail: [false, []],
      IncludeZeroValue: [false, []],
      IsActive: [false, []],
    },
      {
        validator: this.CheckDate,
      });
  }

  public ngOnDestroy(): void {

  }


}
