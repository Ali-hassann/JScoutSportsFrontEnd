import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
// import { AppBreadcrumbService } from 'src/app/application/components/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AccountHeadsFilterRequest } from 'src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model';
import { SubCategoriesResponse } from 'src/app/modules/accounts/charts-of-accounts/models/sub-category.model';
import { SubCategoryQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/sub-category.query';
import { UiVoucherQuery } from 'src/app/modules/accounts/voucher/states/ui-state/ui-voucher.query';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { environment } from 'src/environments/environment';
import { PrintSubCategoryReportsRequest, SubCategoryListResponse } from '../../models/sub-category-reports.model';
import { SubCategoryReportsService } from '../../services/sub-category-reports.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sub-category-reports',
  templateUrl: './sub-category-reports.component.html',
  styleUrls: ['./sub-category-reports.component.scss']
})
export class SubCategoryReportsComponent implements OnInit {


  public subCategoriesList: SubCategoriesResponse[] = [];
  public subCategoryReportsList$: Observable<SubCategoryListResponse[]> | any;
  public subCategoryReportsForm: FormGroup | any;
  public SearchText: string = '';
  public subCategoryyReportRequest: PrintSubCategoryReportsRequest = new PrintSubCategoryReportsRequest();
  public isDataLoading$: Observable<boolean> = of(false);

  constructor(
    private _fileViewerService: FileViewerService,
    private _authQuery: AuthQuery,
    private _subCategoryReportsService: SubCategoryReportsService,
    private _subCategoryQuery: SubCategoryQuery,
    private _fb: FormBuilder,
    private _dval: DomainValidatorsService,
    // private _breadCrumbService: AppBreadcrumbService,
    private _messageService: MessageService,
    private _uiVoucherQuery: UiVoucherQuery,
  ) {
    this.buildForm();
    this._subCategoryQuery.subCategoryList$.subscribe(
      (x: any) => {
        this.subCategoriesList = x;
      }
    );
  }

  ngOnInit(): void {
    this.initialDataServiceCalls();
    this.setBreadCrumb();
  }

  public setBreadCrumb(): void {
    // this._breadCrumbService.setItems([
    //   { label: 'Reports' },
    //   { label: 'Sub Category' },
    // ]);
  }

  public printVoucher() {
    if (this.subCategoryReportsForm.invalid) {
      this.subCategoryReportsForm.markAllAsTouched();
      return
    }
    let printSubCategoryReportsRequest = new PrintSubCategoryReportsRequest();
    this._dval.assignFormValuesToObject(this.subCategoryReportsForm, printSubCategoryReportsRequest);
    printSubCategoryReportsRequest.FromDate = DateHelperService.getServerDateFormat(printSubCategoryReportsRequest.FromDate);
    printSubCategoryReportsRequest.ToDate = DateHelperService.getServerDateFormat(printSubCategoryReportsRequest.ToDate);
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._subCategoryReportsService.printSubCategoryReports(printSubCategoryReportsRequest).pipe(
      map((response: any) => {
        if (response) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });

          let blob: Blob = response.body as Blob;
          let frame = document.getElementById("frame") as HTMLIFrameElement;
          frame.src = window.URL.createObjectURL(blob);

        }
        else {
          this._messageService.add({ severity: 'info', summary: 'Info', detail: 'No record found for selected criteria', life: 3000 });
          this._messageService.clear();
        }
      })
    ).subscribe();
  }

  public initialDataServiceCalls(): void {
    if (!this._subCategoryQuery.hasEntity()) {
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
    this.subCategoryReportsForm = this._fb.group({
      OrganizationId: [this._authQuery.OrganizationId, [Validators.required]],
      OutletId: [this._authQuery.OutletId, [Validators.required]],
      SubCategoriesId: [0, [Validators.required, Validators.min(1)]],
      FromDate: [new Date(), [Validators.required]],
      ToDate: [new Date(), [Validators.required]],
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
