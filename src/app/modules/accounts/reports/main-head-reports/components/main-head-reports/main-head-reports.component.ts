import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
// import { AppBreadcrumbService } from 'src/app/application/components/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MainHeadsResponse } from 'src/app/modules/accounts/charts-of-accounts/models/main-head.model';
import { MainHeadService } from 'src/app/modules/accounts/charts-of-accounts/services/main-head.service';
import { MeanHeadQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/main-head.query';
import { UiVoucherQuery } from 'src/app/modules/accounts/voucher/states/ui-state/ui-voucher.query';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { environment } from 'src/environments/environment';
import { MainHeadListResponse, PrintMainHeadReportsRequest } from '../../models/main-head-category.model';
import { MainHeadCategoryReportsService } from '../../services/main-head-category-reports.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-main-head-reports',
  templateUrl: './main-head-reports.component.html',
  styleUrls: ['./main-head-reports.component.scss']
})
export class MainHeadReportsComponent implements OnInit {

  public mainHeadList: MainHeadsResponse[] = [];
  public mainHeadReportList$: Observable<MainHeadListResponse[]> | any;
  public mainHeadReportRequestForm: FormGroup | any;
  public SearchText: string = '';
  public isDataLoading$: Observable<boolean> = of(false);
  public mainHeadReportRequest: PrintMainHeadReportsRequest = new PrintMainHeadReportsRequest();
  public unpostedVoucherCount$: Observable<number>;

  constructor(
    private _authQuery: AuthQuery,
    private _mainHeadCategoryReportsService: MainHeadCategoryReportsService,
    private _meanHeadQuery: MeanHeadQuery,
    private _mainHeadService: MainHeadService,
    private _fb: FormBuilder,
    private _dval: DomainValidatorsService,
    // private _breadCrumbService: AppBreadcrumbService,
    private _uiVoucherQuery: UiVoucherQuery,
    private _messageService: MessageService,
  ) {
    this.buildForm();
    this._meanHeadQuery.mainHeadList$.subscribe(
      (x) => {
        this.mainHeadList = x
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
    //   { label: 'Main Head' },
    // ]);
  }

  public printVoucher() {
    if (this.mainHeadReportRequestForm.invalid) {
      this.mainHeadReportRequestForm.markAllAsTouched();
      return
    }
    let printMainHeadReportsRequest = new PrintMainHeadReportsRequest();
    this._dval.assignFormValuesToObject(this.mainHeadReportRequestForm, printMainHeadReportsRequest);
    printMainHeadReportsRequest.FromDate = DateHelperService.getServerDateFormat(printMainHeadReportsRequest.FromDate);
    printMainHeadReportsRequest.ToDate = DateHelperService.getServerDateFormat(printMainHeadReportsRequest.ToDate);
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._mainHeadCategoryReportsService.printMainHeadReports(printMainHeadReportsRequest).pipe(
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
          this._messageService.add({ severity: 'info', summary: 'Info', detail: 'No record found for selected criteria', life: 3000 });
        }
      })
    ).subscribe();
  }

  private initialDataServiceCalls(): void {
    if (!this._meanHeadQuery.hasEntity()) {
      this._mainHeadService.getMainHeadList();
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
    this.mainHeadReportRequestForm = this._fb.group({
      OrganizationId: [this._authQuery.OrganizationId, [Validators.required]],
      OutletId: [this._authQuery.OutletId, [Validators.required]],
      MainHeadId: [0, [Validators.required, Validators.min(1)]],
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
