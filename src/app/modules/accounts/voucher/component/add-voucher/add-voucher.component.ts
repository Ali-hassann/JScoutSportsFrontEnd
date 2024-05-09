import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityStateHistoryPlugin } from '@datorama/akita';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { distinct, tap } from 'rxjs/operators';
import { ConfigurationSettingComponent } from 'src/app/modules/accounts/accounts-configuration/component/accounts-configuration/configuration-setting.component';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { Gallery as ImagesRequest } from 'src/app/modules/common/gallery/models/gallery.model';
import { VOUCHER_TRANSACTION_TYPE, VOUCHER_TYPE } from 'src/app/shared/enums/voucher.enum';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { environment } from 'src/environments/environment';
import { VoucherImagesRequest, VouchersDetailRequest, VouchersMasterRequest } from '../../models/voucher.model';
import { VoucherService } from '../../services/voucher.service';
import { VoucherQuery } from '../../states/data-state/voucher-query';
import { ConfigurationSettingQuery } from '../../../accounts-configuration/states/data-states/accounts-configuration.query';

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrls: ['./add-voucher.component.scss'],
})
export class AddVoucherComponent implements OnInit {

  public voucherMasterRequest: VouchersMasterRequest = new VouchersMasterRequest();
  public hasAccountsConfiguration: boolean = false;

  // Voucher Child Data
  // VoucherDetailList as Child Data based on VoucherType => {Input Decorators}
  public paymentVoucherDetailList: VouchersDetailRequest[] = [];
  public receiptVoucherDetailList: VouchersDetailRequest[] = [];
  public journalVoucherDetailList: VouchersDetailRequest[] = [];
  public bankReceiptVoucherDetailList: VouchersDetailRequest[] = [];
  public multiPaymentVoucherDetailList: VouchersDetailRequest[] = [];
  //

  public isSaveButtonClicked: boolean = false;
  public isUpdateCase: boolean = false;
  public isDataSaved: boolean = false;
  //

  public isToShowMessage: boolean = true;
  public datePickerFormat = DateHelperService.datePickerFormat;
  public voucherDate: Date | any;

  public voucherStateHistory: EntityStateHistoryPlugin | any;

  // Form Group/Controls Properties
  public addVoucherForm: FormGroup = this._formBuilder.group({});

  public frmCtrlTotalAmount: FormControl | any;
  public frmCtrlVoucherDate: FormControl | any;
  //

  public voucherType = VOUCHER_TYPE; // For ngSwitch
  public VOUCHER_TYPE = VOUCHER_TYPE; // For ngSwitchCase
  public voucherTypeName: string = ""; // For local logical use
  public childVoucherTransactionType: string = ""; // Selected VoucherTransactionType on child form
  public VOUCHER_TRANSACTION_TYPE = VOUCHER_TRANSACTION_TYPE;
  public images: ImagesRequest[] = [];
  public voucherImages: VoucherImagesRequest[] = [];

  constructor(
    private _config: DynamicDialogConfig
    , private _dialogRef: DynamicDialogRef
    , private _formBuilder: FormBuilder
    , private _authQuery: AuthQuery
    , private _dVal: DomainValidatorsService
    , private _voucherService: VoucherService
    , private _voucherQuery: VoucherQuery
    , private _accountsConfiQuery: ConfigurationSettingQuery
    , private _commonHelperService: CommonHelperService
    , private _dialogService: DialogService
    , private _messageService: MessageService,
  ) {


    //
  }

  public ngOnInit(): void {

    // Assigning Parent Form Date Values
    if (this._config?.data) {

      this.voucherType = this._config?.data?.VoucherType;
      this.voucherMasterRequest = this._config?.data?.VoucherMaster;
      // Setting VoucherTypeName 
      let voucherTypeId = this._config?.data?.VoucherType;
      this.voucherTypeName =
        (
          voucherTypeId == VOUCHER_TYPE.Journal ? VOUCHER_TYPE[VOUCHER_TYPE.Journal]
            : voucherTypeId == VOUCHER_TYPE.CashPayment ? VOUCHER_TYPE[VOUCHER_TYPE.CashPayment]
              : voucherTypeId == VOUCHER_TYPE.CashReceipt ? VOUCHER_TYPE[VOUCHER_TYPE.CashReceipt]
                : voucherTypeId == VOUCHER_TYPE.BankReceipt ? VOUCHER_TYPE[VOUCHER_TYPE.BankReceipt]
                  : "None"
        );
      //
    }

    this.buildForm(this.voucherMasterRequest?.VoucherStatus ?? 0);
    this.assignLocalFormControlValues();
    this.initialDataServiceCalls();
    this.assignObservableValues();
    if (this.voucherMasterRequest.VouchersMasterId) {
      this.assignParentFormData();
    }

    // Setting State For Sotre Undo Process
    this.voucherStateHistory = new EntityStateHistoryPlugin(this._voucherQuery);
    //
  }

  public saveVoucher(): void {

    // This isSaveButtonClicked property triggered the ngOnChanges event 
    // on Child Components to get VoucherDetail data to save
    this.isSaveButtonClicked = true;
  }

  public receiveChildVoucherData(voucherDetailChildRequest: VouchersDetailRequest[]) {
    this.isSaveButtonClicked = false;
    this.isDataSaved = false;
    if (voucherDetailChildRequest?.length > 0) {

      this.addImagesInVoucherRequest(this.voucherMasterRequest.VouchersMasterId);
      this.voucherMasterRequest.VoucherImagesRequest = this.voucherImages;
      this._dVal.assignFormValuesToObject(this.addVoucherForm, this.voucherMasterRequest);
      this.voucherMasterRequest.OutletId = this._authQuery.PROFILE.CurrentOutletId;
      // this.voucherMasterRequest.VoucherTypeId = this._authQuery.PROFILE.OrganizationId;
      // Voucher Master Logical Working     
      this.voucherMasterRequest.VoucherDate = DateHelperService.getServerDateFormat(this.voucherMasterRequest.VoucherDate);
      this.voucherMasterRequest.VouchersDetailRequest = voucherDetailChildRequest;
      //

      if (this.voucherMasterRequest.VouchersMasterId > 0) {
        this.updateVoucher();
      }
      else {
        this.addVoucher();
      }
    }
    else {
      this._messageService.add({ severity: 'info', summary: 'Info', detail: 'Nothing to save.', life: 3000 });
    }
  }

  public receiveChildTotalDebitAmount(totalDebitAmount: number): void {
    
    this.frmCtrlTotalAmount.setValue(totalDebitAmount);
  }

  public showWarningForAccountsConfiguration(voucherTransactionTypes: string): void {

    // Show/Hide Warning Message for AccountsConfiguration
    this.childVoucherTransactionType = voucherTransactionTypes;
    //
  }

  public onGalleryChange(event: ImagesRequest[]): void {
    this.images = event;
  }

  public addImagesInVoucherRequest(voucherMasterId: number): void {
    this.voucherImages = [];
    this.voucherImages = this.images?.map(x => {
      let voucherImageRequest: VoucherImagesRequest = new VoucherImagesRequest();
      voucherImageRequest.VouchersMasterId = voucherMasterId;
      if (x.IsNew) {
        
        voucherImageRequest.VoucherImagesId = 0;
        //index sometime 22 or 23 its depend on image type belew line find auurate index automatically
        let index = x.Path.indexOf('base64,');

        //find index of 'base64,' and + 7 of length of 'base64,' character for total length and accurate index
        voucherImageRequest.Imagepath = x.Path.slice(index + 7);
      }
      else {
        voucherImageRequest.VoucherImagesId = x.Id;
        voucherImageRequest.Imagepath = x.Path;
      }
      voucherImageRequest.IsDeleted = x.IsDeleted;
      return voucherImageRequest;
    });
  }
  public close(): void {
    this._dialogRef.close();
  }

  public closeAccountsConfigurationWarning(): void {
    this.isToShowMessage = false;
  }

  public openAccountsConfigurationDialog(): void {

    // Loading Dynamically Module
    this._commonHelperService
      .loadModule
      (
        () => import('src/app/modules/accounts/accounts-configuration/configuration-setting.module')
          .then(x => x.AccountsConfigurationModule)
      );
    //

    let dialogRef = this._dialogService.open(ConfigurationSettingComponent, {
      header: `Accounts Configuration`,
      width: '50%',
      height: '70%'
    });
  }

  //#region Private Functions

  private assignObservableValues(): void {

    this.hasAccountsConfiguration = (this._accountsConfiQuery.configurationSetting.find(s => s.AccountName === "CashAccount")?.AccountValue ?? 0) > 0;

    this.frmCtrlVoucherDate = this.addVoucherForm.controls["VoucherDate"] as FormControl;

    // Assign Observable Value on Voucher Date Change
    this.frmCtrlVoucherDate
      .valueChanges
      .pipe
      (
        distinct(),
        tap(voucherDate => {
          if (voucherDate) {
            this.voucherDate = voucherDate;
          }
        })
      ).subscribe();
    //
  }

  private updateVoucher(): void {

    this.close();
    this.voucherImages = [];
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Voucher Being Saved', sticky: true });
    // Call for Add Voucher Master/Detail
    this._voucherService
      .updateVoucher(this.voucherMasterRequest)
      .pipe
      (
        tap(voucherUpdateResponse => {
          if (voucherUpdateResponse) {
            this._messageService.clear();
            this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Voucher updated successfully.', life: 3000 });
            // voucher store working
            this._voucherQuery.updateVoucher(voucherUpdateResponse);
            //
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
            this._messageService.add({
              severity: 'error',
              summary: 'Error Message',
              detail: 'An error occurred. Please try again later.',
              life: 3000
            });

            this.voucherStateHistory.undo();
          })
      ).subscribe();
    //
  }

  private addVoucher(): void {
    // Adding voucher with 0 Id for Store Identity
    this._voucherQuery.addVoucher(this.voucherMasterRequest);
    //
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Voucher being saved', sticky: true });
    // Call for Add Voucher Master/Detail
    this._voucherService
      .addVoucher(this.voucherMasterRequest)
      .pipe
      (
        tap(voucherAddResponse => {
          if (voucherAddResponse) {
            this._messageService.clear();
            this._messageService.add({ severity: 'success', summary: 'Successful', detail: `${this.voucherTypeName} Voucher added successfully.`, life: 3000 });
            // voucher store working
            this._voucherQuery.removeVoucherById(0);
            this._voucherQuery.addVoucher(voucherAddResponse);
            //

            this.isDataSaved = true;

            // Reset Form Fields 
            this.assignDefaultFormValues();
            this.images = [];
            this.voucherImages = [];
            //
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
            this.voucherStateHistory.undo();
            this._messageService.clear();
            this._messageService.add({
              severity: 'error',
              summary: 'Error Message',
              detail: 'An error occurred. Please try again later.',
              life: 3000
            });

          })
      ).subscribe();
    //    
  }

  private assignDefaultFormValues(): void {
    this.journalVoucherDetailList = [];
    this.paymentVoucherDetailList = [];
    this.receiptVoucherDetailList = [];
    this.bankReceiptVoucherDetailList = [];
    this.multiPaymentVoucherDetailList = [];
    this.voucherMasterRequest = new VouchersMasterRequest();

    this.buildForm(0);
    this.assignLocalFormControlValues();
    this.frmCtrlVoucherDate.setValue(DateHelperService.getDatePickerFormat(this.voucherDate));

  }

  private initialDataServiceCalls(): void {
    this.getVouchersById();
  }

  private getVouchersById(): void {

    if (this.voucherMasterRequest.VouchersMasterId > 0) {

      this.isUpdateCase = true;
      this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Data is being fetched', sticky: true });
      // Getting Voucher Data for Update Case    
      this._voucherService
        .getVouchersById(this.voucherMasterRequest.VouchersMasterId)
        .pipe
        (
          tap(vouchersMasterResponse => {

            if (vouchersMasterResponse) {
              if (vouchersMasterResponse.VoucherImagesRequest) {
                this.images = vouchersMasterResponse.VoucherImagesRequest?.map(x => {
                  let image: ImagesRequest = {
                    Id: x.VoucherImagesId,
                    Path: environment.baseUrlApp + x.Imagepath,
                    IsNew: false,
                    IsDeleted: x.IsDeleted,
                    IsSelected: false
                  };
                  return image;
                })
              }
              else {
                this.images = [];
              }
              this._messageService.clear();
              this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data is fetched successfully.', life: 3000 });
              // Assigning Voucher MasterData
              this.voucherMasterRequest = vouchersMasterResponse;

              this.addVoucherForm.controls['VoucherDate'].setValue(DateHelperService.getDatePickerFormat(this.voucherMasterRequest.VoucherDate));
              //

              // Assigning VoucherDetail Data
              switch (this.voucherMasterRequest.VoucherTypeId) {

                case VOUCHER_TYPE.CashReceipt:
                  this.receiptVoucherDetailList = this.voucherMasterRequest.VouchersDetailRequest;
                  break;

                case VOUCHER_TYPE.CashPayment:
                  this.paymentVoucherDetailList = this.voucherMasterRequest.VouchersDetailRequest;
                  break;

                case VOUCHER_TYPE.Journal:
                  this.journalVoucherDetailList = this.voucherMasterRequest.VouchersDetailRequest;
                  break;
                case VOUCHER_TYPE.BankReceipt:
                  this.bankReceiptVoucherDetailList = this.voucherMasterRequest.VouchersDetailRequest;
                  break;
                case VOUCHER_TYPE.BankPayment:
                  this.multiPaymentVoucherDetailList = this.voucherMasterRequest.VouchersDetailRequest;
                  break;
              }
              //
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
          }, error => {
            this._messageService.clear();
            this._messageService.add({
              severity: 'error',
              summary: 'Error Message',
              detail: 'An error occurred. Please try again later.',
              life: 3000
            });
          })
        ).subscribe();
      //
    }
    else {
      this.isUpdateCase = false;
    }
  }

  private assignLocalFormControlValues(): void {

    this.frmCtrlTotalAmount = this.addVoucherForm.controls["TotalAmount"] as FormControl;
    this.frmCtrlVoucherDate = this.addVoucherForm.controls["VoucherDate"] as FormControl;
  }

  private assignParentFormData(): void {
    this._dVal.assignObjectValuesToForm(this.addVoucherForm, this.voucherMasterRequest);
  }

  private buildForm(voucherStatus: number = 0): void {
    this.addVoucherForm = this._formBuilder
      .group
      ({
        VouchersMasterId: [0, [Validators.required]],
        ReferenceNo: ["", []],
        VoucherTypeId: [this.voucherType, [Validators.required]],
        VoucherStatus: [voucherStatus, [Validators.required]],
        VoucherDate: [new Date(), [Validators.required]],
        Remarks: ["", [Validators.required]],
        TotalAmount: [0, [Validators.required]],
        OrganizationId: [this._authQuery.PROFILE.OrganizationId, [Validators.required]],
        OutletId: [this._authQuery?.PROFILE?.CurrentOutletId, [Validators.required]],
      });
  }
  //#endregion
}