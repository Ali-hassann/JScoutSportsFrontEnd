import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { VoucherListRequest, VoucherMasterList, VouchersMasterRequest } from '../../models/voucher.model';
import { VoucherService } from '../../services/voucher.service';
import { AddVoucherComponent } from '../add-voucher/add-voucher.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { VoucherQuery } from '../../states/data-state/voucher-query';
import { map, tap } from 'rxjs/operators';
import { VOUCHER_STATUS, VOUCHER_TYPE } from 'src/app/shared/enums/voucher.enum';
import { EntityStateHistoryPlugin } from '@datorama/akita';
import { UiVoucherQuery } from '../../states/ui-state/ui-voucher.query';
import { PaginationBase } from 'src/app/shared/models/base.model';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
// import { AppBreadcrumbService } from 'src/app/application/components/app.breadcrumb.service';

import { Table } from 'primeng/table';
import { UserRightsQuery } from 'src/app/modules/setting/rights/states/user-rights.query';
import { Users } from 'src/app/modules/setting/users/models/users.models';
import { UserQuery } from 'src/app/modules/setting/users/states/data-state/user-query';
import { Voucher } from 'src/app/shared/enums/rights.enum';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { JournalComponent } from '../journal/journal.component';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss']

})
export class VoucherListComponent implements OnInit {

  Voucher = Voucher;

  public voucherListPaginationRequest: VoucherListRequest = new VoucherListRequest();
  public voucherMasterList: VoucherMasterList[] = [];
  public userList: Users[] = [];
  public isDataLoading: boolean = false;
  public isAnySelected$: Observable<boolean>;
  public isSchoolAdmin$: Observable<boolean> | any;
  public isAccountAdmin$: Observable<boolean>;
  public hasAdminRights$: Observable<boolean>;

  public voucherStateHistory: EntityStateHistoryPlugin | any;
  public voucherStatus = [
    { name: 'All', value: -1 },
    { name: 'UnPosted', value: 0 },
    { name: 'Posted', value: 2 }
  ]
  public voucherTypes: MenuItem[] = [];
  public datePickerFormat = DateHelperService.datePickerFormat;


  // Form Group/Controls Properties
  public voucherListForm: FormGroup | any;
  public frmCtrlOrganizationId: FormControl | any;
  public frmCtrlOutletId: FormControl | any;
  public frmCtrlSearchQuery: FormControl | any;
  public frmCtrlVoucherTypeId: FormControl | any;
  public frmCtrlFromDate: FormControl | any;
  public frmCtrlToDate: FormControl | any;
  public frmCtrlCreatedBy: FormControl | any;
  //

  public voucherTypeList = [
    { name: 'All', value: VOUCHER_TYPE.None },
    { name: 'Cash Payment', value: VOUCHER_TYPE.CashPayment },
    { name: 'Bank Payment', value: VOUCHER_TYPE.BankPayment },
    { name: 'Cash Receipt', value: VOUCHER_TYPE.CashReceipt },
    { name: 'Bank Receipt', value: VOUCHER_TYPE.BankReceipt },
    { name: 'Journal', value: VOUCHER_TYPE.Journal },
    // { name: 'Bank Receipt', value: VOUCHER_TYPE.BankReceipt },
  ];

  public IsToshowPrintBtn: boolean = false;
  // public confirmPopupMessage: string = '';
  constructor(
    private _dialogService: DialogService
    , private _voucherService: VoucherService
    , private _voucherQuery: VoucherQuery
    , private _formBuilder: FormBuilder
    , private _authQuery: AuthQuery
    , private _breadCrumbService: AppBreadcrumbService
    , private _messageService: MessageService
    , private _confirmationService: ConfirmationService
    , private _uiVoucherQuery: UiVoucherQuery
    , private _fileViewerService: FileViewerService
    , private _dval: DomainValidatorsService
    , private rightsQu: UserRightsQuery,
    private _usersQueryService: UserQuery,

  ) {
    this._usersQueryService.users$.subscribe(
      (x: any) => {
        this.userList = x;
      }
    );
    this.isAnySelected$ = this._voucherQuery.isAnySelected$;
    this.isAccountAdmin$ = this._authQuery.isAccountAdmin$;
    this.hasAdminRights$ = this._authQuery.hasAccountAdminRights$;
  }

  public ngOnInit(): void {
    this.buildForm();
    this.assignLocalFormControlValues();
    this.assignObservableValues();
    this.initialDataServiceCalls();
    this.assignDefaultFormValues();
    this.uiDataBinding();
    this.onVoucherRequestFormChanges();

    // Setting State For Sotre Undo Process
    this.voucherStateHistory = new EntityStateHistoryPlugin(this._voucherQuery);
    //

    // Setting State For DataLoading
    this._voucherQuery.isDataLoading$.subscribe((x: any) => {
      this.isDataLoading = x;
    });

    //
  }

  sellectAll(event: any) {
    if (event && (event?.checked ?? false)) {
      this._voucherQuery.selectAllVouchers();
    } else {
      this._voucherQuery.unSelectAllVouchers();
    }
  }

  sellectSingle(event: any, voucherMasterId: number) {
    if (event && (event?.checked ?? false)) {
      this._voucherQuery.selectSingleVouchers(voucherMasterId);
    } else {
      this._voucherQuery.unSelectSingleVouchers(voucherMasterId);
    }
  }

  postSelectedVouchers(status: number) {
    let postingVouchers: number[] = [];
    if (status === +VOUCHER_STATUS.Posted) {
      postingVouchers = this._voucherQuery.getSelectedVouchersForPostingAdmin();
    } else {
      postingVouchers = [];
    }

    if (postingVouchers?.length > 0) {
      // call method
      this.postMultipleVouchers(postingVouchers, status);
    } else {
      // show alert ..
      this._voucherQuery.unSelectAllVouchers();
      this._messageService.add({ severity: 'info', summary: 'Info', detail: 'Voucher Already Posted', life: 3000 });
    }
  }

  public postVoucher(vouchersMasterId: number, status: number): void {

    this.postMultipleVouchers([vouchersMasterId], status);
  }

  private postMultipleVouchers(vouchersMasterIds: number[], status: number) {

    // this.confirmPopupMessage =;
    this._confirmationService

      .confirm({
        message: `Are you sure you want to post the selected ${vouchersMasterIds?.length} voucher(s) ?`,
        accept: () => {
          this._voucherService
            .postMultipleVouchers(vouchersMasterIds, status)
            .pipe(
              tap(isPosted => {
                if (isPosted) {
                  this._messageService.add({ severity: 'success', summary: 'Successful', detail: `${vouchersMasterIds?.length} Voucher posted successfully`, life: 3000 });
                  this._voucherQuery.postMultipleVouchers(vouchersMasterIds, status);
                }
                else {
                  this._messageService.add({
                    severity: 'error',
                    summary: 'Error Message',
                    detail: 'An error occurred. Please try again later.',
                    life: 3000
                  });
                }
              },
                error => {
                  this.voucherStateHistory.undo();
                  this._messageService.add({
                    severity: 'error',
                    summary: 'Error Message',
                    detail: 'An error occurred. Please try again later.',
                    life: 3000
                  });

                })
            ).subscribe();
        }
      });
  }

  public openAddVoucherDialog(
    voucherType: VOUCHER_TYPE
    , voucherMasterRequest?: VoucherMasterList | any
  ): void {

    // Creating Request data for child form => {AddVoucher}
    let parentFormData: any =
    {
      VoucherType: voucherType
      , VoucherMaster: voucherMasterRequest ?? new VoucherMasterList()
    };
    //

    let childHeader = voucherMasterRequest?.VouchersMasterId > 0
      ? `Edit ${VOUCHER_TYPE[voucherType]} Voucher (${voucherMasterRequest?.VouchersMasterId})`
      : `Add Cash Payment Voucher`;
    // : `Add ${VOUCHER_TYPE[voucherType]} Voucher`;
    let dialogRef = this._dialogService.open(AddVoucherComponent, {
      header: childHeader,
      width: '80%',
      height: '100%',
      data: parentFormData
    });
  }

  public removeVoucher(voucherMasterRequest: VoucherMasterList): void {
    // this.confirmPopupMessage = 

    this._confirmationService
      .confirm
      ({
        message: `Are you sure you want to delete ${voucherMasterRequest.VouchersMasterId} voucher ?`,
        accept: () => {

          this._messageService.add({ severity: 'info', summary: 'Loading', detail: `${voucherMasterRequest.VouchersMasterId} Voucher being deleted`, sticky: true });
          this._voucherService
            .removeVoucher(voucherMasterRequest.VouchersMasterId)
            .pipe
            (
              tap(isDeleted => {
                if (isDeleted) {
                  this._messageService.clear();
                  this._voucherQuery.removeVoucherById(voucherMasterRequest.VouchersMasterId);
                  this._messageService.add({ severity: 'success', summary: 'Successful', detail: `${voucherMasterRequest.VouchersMasterId} Voucher deleted successfully`, life: 3000 });
                }
                else {
                  this._messageService.clear();
                  this._messageService.add({
                    severity: 'error',
                    summary: 'Error Message',
                    detail: 'An error occurred. Please try again later.',
                    life: 3000
                  });
                }
              },
                error => {
                  this._messageService.clear();
                  this.voucherStateHistory.undo();
                  this._messageService.add({
                    severity: 'error',
                    summary: 'Error Message',
                    detail: 'An error occurred. Please try again later.',
                    life: 3000
                  });

                })
            ).subscribe();
        }
      });
  }

  // public postVoucher(vouchersMasterId: number): void {
  //   this.postMultipleVouchers([vouchersMasterId]);
  // }

  // private postMultipleVouchers(vouchersMasterIds: number[]) {

  //   this.confirmPopupMessage = 'Are you sure you want to post the selected voucher/s ?';
  //   this._confirmationService
  //     .confirm({
  //       accept: () => {

  //         // Updating voucher from store
  //         this._voucherQuery.postMultipleVouchers(vouchersMasterIds);
  //         //
  //         this._voucherService
  //           .postMultipleVouchers(vouchersMasterIds)
  //           .pipe(
  //             tap(isPosted => {
  //               if (isPosted) {
  //                 this._voucherQuery.postMultipleVouchers(vouchersMasterIds);
  //               }
  //               else {
  //               }
  //             },
  //               error => {
  //                 this.voucherStateHistory.undo();
  //               })
  //           ).subscribe();
  //       }
  //     });
  // }

  public printVoucher(vouchersMasterId: number): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._voucherService
      .printVoucher(vouchersMasterId).subscribe(reportResponse => {
        if (reportResponse) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });
          this._fileViewerService.loadFileViewer(reportResponse);
        }
        else {
          this._messageService.clear();
          this._messageService.add({ severity: 'info', summary: 'Info', detail: 'No record found for selected criteria', life: 3000 });
        }
      });
  }

  private assignDefaultFormValues(): void {

    // Setting default configuration for (Voucher Types) menu Items List => {Tiered Menu}
    this.voucherTypes = [
      {
        label: 'Voucher',
        command: e => {
          // this.openAddVoucherDialog(VOUCHER_TYPE.Journal, null)
          this.addVoucher();
        }
      },
      {
        label: 'Cash Voucher',
        command: e => {
          // this.openAddVoucherDialog(VOUCHER_TYPE.Payment, null)
          this.addPaymentVoucher()
        }
      },
      // {
      //   label: 'Receipt Voucher',
      //   command: e => {
      //     this.openAddVoucherDialog(VOUCHER_TYPE.Receipt, null)
      //   }
      // },
      // {
      //   label: 'Bank Receipt Voucher',
      //   command: e => {
      //     this.openAddVoucherDialog(VOUCHER_TYPE.BankReceipt, null)
      //   }
      // },
      // {
      //   label: 'Cash Payment Voucher',
      //   command: e => {
      //     this.openAddVoucherDialog(VOUCHER_TYPE.MultiPayment, null)
      //   }
      // },
    ]
    //

    // Setting Bread Crumb Configuration
    this.setBreadCrumb();
    //
  }

  private setBreadCrumb(): void {
    this._breadCrumbService
      .setBreadcrumbs
      (
        [
          { label: 'Voucher List' }
        ]
      );
  }

  private assignObservableValues(): void {

    this._voucherQuery.voucherListResponse$.subscribe(
      (x: any) => {
        this.voucherMasterList = x;
      }
    );

    // Assigning uiVoucherPagination Result
    this._uiVoucherQuery
      .uiVoucherListPagination$
      .pipe
      (
        map(uiVoucherListPagination => {

          CommonHelperService.mapSourceObjToDestination(uiVoucherListPagination, this.voucherListPaginationRequest);
        })
      ).subscribe();
    //
  }

  private assignLocalFormControlValues(): void {
    this.frmCtrlOrganizationId = this.voucherListForm.controls["OrganizationId"] as FormControl;
    this.frmCtrlOutletId = this.voucherListForm.controls["OutletId"] as FormControl;
    this.frmCtrlSearchQuery = this.voucherListForm.controls["SearchQuery"] as FormControl;
    this.frmCtrlVoucherTypeId = this.voucherListForm.controls["VoucherTypeId"] as FormControl;
    this.frmCtrlFromDate = this.voucherListForm.controls["FromDate"] as FormControl;
    this.frmCtrlToDate = this.voucherListForm.controls["ToDate"] as FormControl;
    this.frmCtrlCreatedBy = this.voucherListForm.controls["CreatedBy"] as FormControl;

    // Mapping FormControl Object Values to Destination Object
    CommonHelperService.assignFormValuesToObject(this.voucherListForm, this.voucherListPaginationRequest);
    //
  }

  private initialDataServiceCalls(): void {
    this.voucherListPaginationRequest.FromDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
    if (!this._voucherQuery.hasEntity()) {
      this.getVouchersListWithPagination();
    }
  }

  public onVoucherRequestFormChanges() {
    this.voucherListForm.valueChanges.subscribe((x: any) => {
      this.IsToshowPrintBtn = false
    })
  }

  public searchVoucherList(): void {
    // 
    this.getVouchersListWithPagination();
  }

  public printDailyVouchers() {
    if (this.voucherListForm.invalid) {
      this.voucherListForm.markAllAsTouched();
      return
    }
    let dailyVoucherReportRequest = new VoucherListRequest();
    this._dval.assignFormValuesToObject(this.voucherListForm, dailyVoucherReportRequest);
    dailyVoucherReportRequest.FromDate = DateHelperService.getServerDateFormat(dailyVoucherReportRequest.FromDate);
    dailyVoucherReportRequest.ToDate = DateHelperService.getServerDateFormat(dailyVoucherReportRequest.ToDate);

    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._voucherService.printDailyVoucherReport(dailyVoucherReportRequest).pipe(
      map((response: any) => {
        if (response) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });
          this._fileViewerService.loadFileViewer(response);
        }
        else {
          this._messageService.clear();
          this._messageService.add({ severity: 'info', summary: 'Info', detail: 'No record found for selected criteria', life: 3000 });
        }
      })
    ).subscribe();
  }

  private getVouchersListWithPagination(): void {
    CommonHelperService.assignFormValuesToObject(this.voucherListForm, this.voucherListPaginationRequest);
    this.voucherListPaginationRequest.FromDate = DateHelperService.getServerDateFormat(this.voucherListPaginationRequest.FromDate);
    this.voucherListPaginationRequest.ToDate = DateHelperService.getServerDateFormat(this.voucherListPaginationRequest.ToDate);
    this.IsToshowPrintBtn = true;
    this._voucherService.getVouchersListWithPagination(this.voucherListPaginationRequest);
  }

  private uiDataBinding(): void {

    if (this._uiVoucherQuery.getUiVoucher()?.OrganizationId) {

      CommonHelperService.mapSourceObjToDestination(this._uiVoucherQuery.getUiVoucher(), this.voucherListPaginationRequest);
    }
  }

  public changePagination(event: any): void {
    if (event) {
      this.voucherListPaginationRequest.PageNumber = event.page + 1;
      this.voucherListPaginationRequest.RecordsPerPage = event.rows;

      this.getVouchersListWithPagination();
    }
  }

  public ngOnDestroy(): void {
    this._uiVoucherQuery.updateUiVoucher(this.voucherListPaginationRequest as PaginationBase);
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

  public onUserClear(): void {
    this.voucherListForm.controls["CreatedBy"].setValue("");
  }

  private buildForm(): void {
    let userName: any = "";
    if (!(this._authQuery?.getHasAdminRights())) {
      userName = this._authQuery?.getUserName();
    }
    this.voucherListForm = this._formBuilder
      .group
      ({
        OrganizationId: [this._authQuery.OrganizationId, [Validators.required]],
        OutletId: [this._authQuery.PROFILE.OutletId, [Validators.required]],
        SearchQuery: ["", []],
        VoucherTypeId: [0, []],
        PostingStatus: [0, []],
        FromDate: [new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()), [Validators.required]],
        ToDate: [new Date(), [Validators.required]],
        CreatedBy: [userName, []],
      },
        {
          validator: this.CheckDate,
        });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  addVoucher(voucher?: VoucherMasterList) {
    let dialogRef = this._dialogService.open(JournalComponent, {
      header: `Voucher ${voucher?.VouchersMasterId ?? 0 > 0 ? `${voucher?.SerialNumber}` : ''}`,
      data: voucher,
      maximizable: true,
      height: '100%',
    });
    dialogRef.onClose.subscribe(isToRefresh => {
      isToRefresh ? this.getVouchersListWithPagination() : '';
    });
  }

  addPaymentVoucher(voucher?: VoucherMasterList) {
    let dialogRef = this._dialogService.open(PaymentComponent, {
      header: `Voucher ${voucher?.VouchersMasterId ?? 0 > 0 ? `${voucher?.SerialNumber}` : ''}`,
      data: voucher,
      maximizable: true,
    });
    dialogRef.onClose.subscribe(isToRefresh => {
      isToRefresh ? this.getVouchersListWithPagination() : '';
    });
  }
}
