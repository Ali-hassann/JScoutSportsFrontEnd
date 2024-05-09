import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AccountHeadsFilterRequest } from 'src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model';
import { PostingAccountsResponse } from 'src/app/modules/accounts/charts-of-accounts/models/posting-accounts.model';
import { PostingAccountsQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/posting-account.query';
import { VOUCHER_TRANSACTION_TYPE } from 'src/app/shared/enums/voucher.enum';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { VouchersDetailRequest } from '../../../models/voucher.model';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.scss']
})
export class JournalVoucherComponent
  implements OnInit, OnChanges {

  // Parent Child Decorators
  @Input() public isSaveButtonClicked: boolean = false;
  @Input() public isDataSaved: boolean = false;
  @Input() public isUpdateCase: boolean = false;
  @Input() public journalVoucherDetailList: VouchersDetailRequest[] = [];

  @Output() public voucherChildRequest: EventEmitter<VouchersDetailRequest[]> = new EventEmitter<VouchersDetailRequest[]>();
  @Output() public totalAmount: EventEmitter<number> = new EventEmitter<number>();
  @Output() public warningTransactionTypes: EventEmitter<string> = new EventEmitter<string>();
  //

  public postingAccountsList: PostingAccountsResponse[] = [];
  public journalVoucherDetailRequest: VouchersDetailRequest = new VouchersDetailRequest();
  public accountHeadsFilterRequest: AccountHeadsFilterRequest = new AccountHeadsFilterRequest();

  public totalDebitAmount: number = 0;
  public totalCreditAmount: number = 0;

  public isAmountValid: boolean = true;

  // Form Group/Controls Properties
  public journalVoucherForm: FormGroup = this._formBuilder.group({});

  public frmCtrlDebitAmount: FormControl = this._formBuilder.control({});
  public frmCtrlCreditAmount: FormControl = this._formBuilder.control({});
  public frmCtrlPostingAccountsId: FormControl = this._formBuilder.control({});
  public frmCtrlPostingAccountsName: FormControl = this._formBuilder.control({});
  public frmCtrlIsDebitAmountValid: FormControl = this._formBuilder.control({});
  public frmCtrlIsCreditAmountValid: FormControl = this._formBuilder.control({});
  public frmCtrlTotalDebitAmount: FormControl = this._formBuilder.control({});
  total: number = 0;
  //

  constructor(
    private _formBuilder: FormBuilder
    , private _dVal: DomainValidatorsService
    , private _postingAccountsQuery: PostingAccountsQuery
    , private _authQuery: AuthQuery
    , private _messageService: MessageService
  ) {

  }

  public ngOnInit(): void {

    this.setInititalFormState();
    this.initialDataServiceCalls();

    this.warningTransactionTypes.emit(VOUCHER_TRANSACTION_TYPE.None);
  }

  public ngOnChanges(parentFormChanges: SimpleChanges | any): void {
    setTimeout(() => {
      if (parentFormChanges?.isSaveButtonClicked?.currentValue ?? false) {

        if (this.isAmountValid) {
          if (this.isUpdateCase) {
            this.voucherChildRequest.emit(this.journalVoucherDetailList);
          }
          else if (this.journalVoucherForm.valid
            && this.frmCtrlIsDebitAmountValid.value
            && this.frmCtrlIsCreditAmountValid.value) {

            this.voucherChildRequest.emit(this.journalVoucherDetailList);

          }
          else {
            
            this.journalVoucherForm.markAllAsTouched();
            this.showToastMessage("Enter Valid Data !!");
          }
        }
        else {
          this.voucherChildRequest.emit([]);
          this.showToastMessage("Invalid Total Amount !!");
        }
      }
      else if (parentFormChanges?.isDataSaved?.currentValue ?? false) {

        this.setInititalFormState();
      }
      else if (parentFormChanges?.journalVoucherDetailList?.currentValue?.length > 0) {

        // Update Credit/Debit Amount Summary
        this.updateFooterSummary();
        //
      }
    }, 200);
  }

  public addjournalVoucherDetail(): void {
    if (this.journalVoucherForm.invalid) {
      this.journalVoucherForm.markAllAsTouched();
      return;
    }

    if (this.frmCtrlIsDebitAmountValid.value || this.frmCtrlIsCreditAmountValid.value) {

      this.journalVoucherDetailRequest = new VouchersDetailRequest();
      this._dVal.assignFormValuesToObject(this.journalVoucherForm, this.journalVoucherDetailRequest);
      this.journalVoucherForm.controls["PostingAccountsId"].setValue(0);
      this.journalVoucherForm.controls["DebitAmount"].setValue(0);
      this.journalVoucherForm.controls["CreditAmount"].setValue(0);

      this.journalVoucherDetailList.unshift(this.journalVoucherDetailRequest);
      this.journalVoucherDetailRequest = new VouchersDetailRequest();

      // Update Credit/Debit Amount Summary
      this.updateFooterSummary();
      //
    }
    else {
      this.validateFormControls();
    }
  }

  public deleteJournalVoucherDetail(rowIndex: number): void {

    if (rowIndex > -1
      && this.journalVoucherDetailList?.length > 0
      && rowIndex >= 0
      && (rowIndex + 1) <= this.journalVoucherDetailList.length) {

      this.journalVoucherDetailList.splice(rowIndex, 1);

      // Update Credit/Debit Amount Summary
      this.updateFooterSummary();
      //
    }
  }

  public onPostingAccountChange(event: any): void {
    if (event?.value) {
      this.frmCtrlPostingAccountsId.setValue(event.value.PostingAccountsId);
      this.frmCtrlPostingAccountsName.setValue(event.value.PostingAccountsName);
    }
  }

  public onDebitAmountChange(event: any): void {

    if (event?.target?.value > 0) {
      this.frmCtrlCreditAmount.setValue(0);
    }
    else {
      this.frmCtrlDebitAmount.setValue(0);
    }
    this.validateFormControls();
  }

  public onCreditAmountChange(event: any): void {
    if (event?.target?.value > 0) {
      this.frmCtrlDebitAmount.setValue(0);
    }
    else {
      this.frmCtrlCreditAmount.setValue(0);
    }
    this.validateFormControls();
  }

  public onRowEditSave(
    voucherDetail: VouchersDetailRequest
    , amountType: string
    , event: any
  ): void {

    if (event?.key == "Enter"
      || event?.key == "Tab"
      || event?.type == "focusout") {

      if (amountType == 'Debit') {

        if (voucherDetail.DebitAmount > 0) {
          voucherDetail.CreditAmount = 0;
        }
        else {
          voucherDetail.DebitAmount = 0;
        }

        this.updateFooterSummary();
      }
      else if (amountType == 'Credit') {

        if (voucherDetail.CreditAmount > 0) {
          voucherDetail.DebitAmount = 0;
        }
        else {
          voucherDetail.CreditAmount = 0;
        }

        this.updateFooterSummary();
      }
    }
  }

  private setInititalFormState(): void {
    this.journalVoucherDetailList = [];
    this.buildForm();
    this.assignLocalFormControlValues();
    this.assignObservableValues();
    this.updateFooterSummary();

    this.frmCtrlPostingAccountsId.setValue(0);
    this.frmCtrlPostingAccountsName.setValue("");
  }

  private assignLocalFormControlValues(): void {

    this.frmCtrlDebitAmount = this.journalVoucherForm.controls["DebitAmount"] as FormControl;
    this.frmCtrlCreditAmount = this.journalVoucherForm.controls["CreditAmount"] as FormControl;
    this.frmCtrlPostingAccountsId = this.journalVoucherForm.controls["PostingAccountsId"] as FormControl;
    this.frmCtrlPostingAccountsName = this.journalVoucherForm.controls["PostingAccountsName"] as FormControl;
    this.frmCtrlIsDebitAmountValid = this.journalVoucherForm.controls["IsDebitAmountValid"] as FormControl;
    this.frmCtrlIsCreditAmountValid = this.journalVoucherForm.controls["IsCreditAmountValid"] as FormControl;
    this.frmCtrlTotalDebitAmount = this.journalVoucherForm.controls["TotalDebitAmount"] as FormControl;
  }

  private validateFormControls(): void {

    // Validation For Debit and Credit Amount
    if (this.frmCtrlDebitAmount.value == 0 && this.frmCtrlCreditAmount.value == 0
      || this.frmCtrlDebitAmount.value > 0 && this.frmCtrlCreditAmount.value > 0) {

      this.frmCtrlIsDebitAmountValid.setValue(false);
      this.frmCtrlIsCreditAmountValid.setValue(false);
    }
    else if (this.frmCtrlDebitAmount.value == 0 && this.frmCtrlCreditAmount.value > 0
      || this.frmCtrlCreditAmount.value == 0 && this.frmCtrlDebitAmount.value > 0) {

      this.frmCtrlIsDebitAmountValid.setValue(true);
      this.frmCtrlIsCreditAmountValid.setValue(true);
    }
    //
  }

  private updateFooterSummary(): void {

    this.totalDebitAmount = 0;
    this.totalCreditAmount = 0;

    this.journalVoucherDetailList
      ?.forEach(voucherDetail => {
        this.totalDebitAmount += voucherDetail.DebitAmount;
        this.totalCreditAmount += voucherDetail.CreditAmount;
      })
    if (this.journalVoucherDetailList.length > 0) {
      this.isAmountValid =
        (
          this.totalDebitAmount > 0
          && this.totalCreditAmount > 0
          && this.totalDebitAmount == this.totalCreditAmount
        );
    }

    this.frmCtrlTotalDebitAmount.setValue(this.totalDebitAmount);
  }

  private assignObservableValues(): void {

    // Assigning Posting Accounts from Store
    this._postingAccountsQuery.activePostingAccountsList$.subscribe(
      (x: any) => {
        this.postingAccountsList = x;
      }
    );
    //

    // Assigning TotalAmount on ParentForm on Control Value Changes
    this.journalVoucherForm
      .controls["TotalDebitAmount"]
      .valueChanges
      .pipe
      (
        tap(totalDebitAmount => {

          if ((totalDebitAmount && this.totalCreditAmount
            && totalDebitAmount == this.totalCreditAmount)) {

            this.totalAmount.emit(totalDebitAmount);
            this.total = totalDebitAmount;
          }
          else {
            this.totalAmount.emit(0);
          }
        })
      ).subscribe();
    //
  }

  private initialDataServiceCalls(): void {

    if (!this._postingAccountsQuery.hasEntity()) {
      this._dVal.assignFormValuesToObject(this.journalVoucherForm, this.accountHeadsFilterRequest);
    }
  }

  private showToastMessage(
    messageToShow: string = "Something went wrong"
    , messageType: string = "error"
    , life: number = 3000)
    : void {

    this._messageService.add({
      severity: messageType,
      summary: messageType == "error" ? 'Error' : 'Successful',
      detail: messageToShow,
      life: life
    });
  }

  private buildForm(): void {
    this.journalVoucherForm = this._formBuilder
      .group
      ({
        OrganizationId: [this._authQuery.OrganizationId, [Validators.required]],
        OutletId: [this._authQuery.OutletId, [Validators.required]],
        VouchersDetailId: [0, [Validators.required]],
        PostingAccountsId: [0, []],
        PostingAccountsName: ["", []],
        Narration: ["", []],
        DebitAmount: [0, [Validators.required]],
        CreditAmount: [0, [Validators.required]],
        VouchersMasterId: [0, [Validators.required]],
        TransactionType: [VOUCHER_TRANSACTION_TYPE.None, [Validators.required]],
        IsDebitAmountValid: [true, []],
        IsCreditAmountValid: [true, []],
        TotalDebitAmount: [0, []]
      });
  }
}