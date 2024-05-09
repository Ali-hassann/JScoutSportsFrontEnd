import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { tap } from 'rxjs/internal/operators/tap';
import { ConfigurationSettingQuery } from 'src/app/modules/accounts/accounts-configuration/states/data-states/accounts-configuration.query';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AccountHeadsFilterRequest } from 'src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model';
import { PostingAccountsResponse } from 'src/app/modules/accounts/charts-of-accounts/models/posting-accounts.model';
import { PostingAccountsQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/posting-account.query';
import { VOUCHER_TRANSACTION_TYPE } from 'src/app/shared/enums/voucher.enum';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { VouchersDetailRequest } from '../../../models/voucher.model';
import { ConfigurationSetting } from 'src/app/modules/accounts/accounts-configuration/models/configuration-setting.model';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';

@Component({
  selector: 'app-payment-voucher',
  templateUrl: './payment-voucher.component.html',
  styleUrls: ['./payment-voucher.component.scss']
})
export class PaymentVoucherComponent implements OnInit {

  // Parent Child Decorators
  @Input() public isSaveButtonClicked: boolean = false;
  @Input() public isDataSaved: boolean = false;
  @Input() public paymentVoucherDetailList: VouchersDetailRequest[] = [];

  @Output() public voucherChildRequest: EventEmitter<VouchersDetailRequest[]> = new EventEmitter<VouchersDetailRequest[]>();
  @Output() public totalAmount: EventEmitter<number> = new EventEmitter<number>();
  @Output() public warningTransactionTypes: EventEmitter<string> = new EventEmitter<string>();
  //

  public postingAccountsList: PostingAccountsResponse[] = [];
  public bankAccountsList: PostingAccountsResponse[] = []; // Filtered by BankAccountsId from Posting Accounts List
  public accountHeadsFilterRequest: AccountHeadsFilterRequest = new AccountHeadsFilterRequest();
  public paymentVoucherDetailRequest: VouchersDetailRequest = new VouchersDetailRequest();
  public configurationSettingList: ConfigurationSetting[] = [];

  public totalDebitAmount: number = 0;
  public totalCreditAmount: number = 0;
  public cashAccountId: number = 0; // For Double Entry
  public bankAccountId: number = 0; // SubCategoryId for Filtering PostingAccounts from => (postingAccountsList$)

  public isAmountValid: boolean = false;

  public selectedTransactionType: string = VOUCHER_TRANSACTION_TYPE.Cash;
  public VOUCHER_TRANSACTION_TYPE = VOUCHER_TRANSACTION_TYPE;

  public datePickerFormat = DateHelperService.datePickerFormat;

  // Form Group/Controls Properties
  public paymentVoucherForm: FormGroup | any;
  public frmGrpChildForm: FormGroup | any;

  public frmCtrlTotalDebitAmount: FormControl | any;
  //

  public statusList = [
    { name: 'Paid', value: true },
    { name: 'Unpaid', value: false },
  ];

  constructor(
    private _formBuilder: FormBuilder
    , private _authQuery: AuthQuery
    , private _postingAccountsQuery: PostingAccountsQuery
    , private _dVal: DomainValidatorsService
    , private _messageService: MessageService
    , private _accountsConfiQuery: ConfigurationSettingQuery,
    private _dialogService: DialogService
  ) { }

  public ngOnInit(): void {
    this.inializeConfiguration();
    this.setInititalFormState();
    this.initialDataServiceCalls();
    this.selectedTransactionType = VOUCHER_TRANSACTION_TYPE.Cash;
  }

  public ngOnChanges(parentFormChanges: SimpleChanges | any): void {

    setTimeout(() => {
      if (parentFormChanges?.isSaveButtonClicked?.currentValue ?? false) {
        if (this.validationBeforeSaving()) {

          this.addPaymentVoucherDetail();

          if (this.isAmountValid) {
            this.voucherChildRequest.emit(this.paymentVoucherDetailList);
          }
          else {
            this.voucherChildRequest.emit([]);
            this.showToastMessage("Invalid Total Amount. Something went wrong.");
          }
        }
      }
      else if (parentFormChanges?.isDataSaved?.currentValue ?? false) {

        this.setInititalFormState();
      }
      else if (parentFormChanges?.paymentVoucherDetailList?.currentValue?.length > 0) {

        this.changeSelectedTransactionType();
        this.setInititalFormState();
        this.assignVoucherDetailToFormControls();
        this.assignAccountsConfigurationToFormControls();
      }

    }, 500);
  }

  inializeConfiguration() {
    this.configurationSettingList = [];
    this._accountsConfiQuery.getAllConfigurationList().forEach(c => {
      let config = new ConfigurationSetting();
      CommonHelperService.mapSourceObjToDestination(c, config);
      this.configurationSettingList.push(config);
    });

    this.cashAccountId = this.configurationSettingList.find(d => d.AccountName === "CashAccount")?.AccountValue ?? 0;
    this.bankAccountId = this.configurationSettingList.find(d => d.AccountName === "Banks")?.AccountValue ?? 0;

    if (this.bankAccountId > 0) {
      this.bankAccountsList = this._postingAccountsQuery.getPostingAccountBySubCategoryId(this.bankAccountId);
    }
    else {
      this.bankAccountsList = [];
    }
    // Warning Messages For Accounts Configuration
    this.warningTransactionTypes.emit(this.getTransactionTypeError());
    //
  }

  public onVoucherTransactionTypeChange(event: any): void {

    if (this.paymentVoucherDetailList.length == 0) {

      this.setInititalFormState();
    }
  }

  public addPaymentVoucherDetail(): void {

    this.paymentVoucherDetailList = [];
    this.paymentVoucherDetailRequest = new VouchersDetailRequest();

    // Creating First Entry for PostingACcounts => {DebitAmount}
    this._dVal.assignFormValuesToObject(this.frmGrpChildForm, this.paymentVoucherDetailRequest);
    this.paymentVoucherDetailRequest.ChequeDate = this.getFormatDateForVoucherDetail(this.paymentVoucherDetailRequest.ChequeDate);
    this.paymentVoucherDetailList.push(this.paymentVoucherDetailRequest);

    // Creating Second Entry for PostingACcounts => {CreditAmount}
    this.addVoucherDetailForCreditAmount(this.selectedTransactionType);
    //
  }

  public addVoucherDetailForCreditAmount(voucherTransactionType: string): void {
    // Creating Model with Second Entry => {CreditAmount}
    let paymentVoucherDetailRequest = new VouchersDetailRequest();

    paymentVoucherDetailRequest.TransactionType = voucherTransactionType;
    paymentVoucherDetailRequest.PostingAccountsId =
      (
        this.selectedTransactionType === this.VOUCHER_TRANSACTION_TYPE.Cash
          ? this.cashAccountId
          : this.frmGrpChildForm.controls["BankAccountId"].value as number
      );
    paymentVoucherDetailRequest.ChequeDate = this.getFormatDateForVoucherDetail(this.paymentVoucherDetailRequest.ChequeDate);
    paymentVoucherDetailRequest.ChequeNo = this.paymentVoucherDetailRequest.ChequeNo;
    paymentVoucherDetailRequest.ChequeStatus = this.paymentVoucherDetailRequest.ChequeStatus;
    paymentVoucherDetailRequest.CreditAmount = this.paymentVoucherDetailRequest.DebitAmount;
    paymentVoucherDetailRequest.DebitAmount = 0;

    this.paymentVoucherDetailList.push(paymentVoucherDetailRequest);
    //

    // Update Total Debit Amount
    this.updateTotalDebitAmount();
    //
  }

  private getFormatDateForVoucherDetail(dateToConvert?: Date | string): Date | string | any {

    if (this.selectedTransactionType === this.VOUCHER_TRANSACTION_TYPE.Bank) {

      return DateHelperService.getServerDateFormat(dateToConvert);
    }

    return null;
  }

  private setInititalFormState(): void {
    this.assignDefaultFormValues();
    this.assignObservableValues();
  }

  private validationBeforeSaving(): boolean {

    if (this.paymentVoucherForm.invalid) {

      this.paymentVoucherForm.markAllAsTouched();
      this.voucherChildRequest.emit([]);
      return false;
    }

    if (!this.configurationSettingList) {
      this.showToastMessage("First set your configuration settings to add voucher.");
      this.voucherChildRequest.emit([]);
      return false;
    }

    if (this.selectedTransactionType === this.VOUCHER_TRANSACTION_TYPE.Cash
      && !(this.cashAccountId > 0)) {

      this.showToastMessage("First set your cash account to add cash entry.");
      this.voucherChildRequest.emit([]);
      return false;
    }
    else if (this.selectedTransactionType === this.VOUCHER_TRANSACTION_TYPE.Bank
      && !(this.bankAccountId > 0)) {

      this.showToastMessage("First set your bank account to add bank entry.");
      this.voucherChildRequest.emit([]);
      return false;
    }

    return true;
  }

  private updateTotalDebitAmount(): void {

    this.totalDebitAmount = 0;
    this.totalCreditAmount = 0;

    this.totalDebitAmount += this.frmGrpChildForm.controls["DebitAmount"].value as number;
    this.totalCreditAmount = this.totalDebitAmount;

    this.isAmountValid =
      (
        this.totalDebitAmount > 0
        && this.totalCreditAmount > 0
        && this.totalDebitAmount == this.totalCreditAmount
      );

    this.frmCtrlTotalDebitAmount.setValue(this.totalDebitAmount);
  }

  private changeSelectedTransactionType(): void {
    let paymentVoucherDetail = this.paymentVoucherDetailList?.find(x => x.DebitAmount > 0) ?? new VouchersDetailRequest();

    if (paymentVoucherDetail) {

      if (paymentVoucherDetail.TransactionType == this.VOUCHER_TRANSACTION_TYPE.Cash) {
        this.selectedTransactionType = this.VOUCHER_TRANSACTION_TYPE.Cash;
      }
      else if (paymentVoucherDetail.TransactionType == this.VOUCHER_TRANSACTION_TYPE.Bank) {
        this.selectedTransactionType = this.VOUCHER_TRANSACTION_TYPE.Bank;
      }
    }
  }

  private assignVoucherDetailToFormControls(): void {
    let paymentVoucherDetail: any = this.paymentVoucherDetailList.find(x => x.DebitAmount > 0) ?? new VouchersDetailRequest();
    if (paymentVoucherDetail) {
      if (paymentVoucherDetail.TransactionType == this.VOUCHER_TRANSACTION_TYPE.Bank) {

        paymentVoucherDetail.ChequeDate = DateHelperService.getDatePickerFormat(paymentVoucherDetail.ChequeDate);
      }

      this._dVal.assignObjectValuesToForm(this.frmGrpChildForm, paymentVoucherDetail);
      // Update Total Debit Amount
      this.updateTotalDebitAmount();
    }
  }

  private assignDefaultFormValues(): void {

    this.buildForm();
    this.assignLocalFormGroupValues();
  }

  private assignAccountsConfigurationToFormControls(): void {

    if (this.selectedTransactionType === this.VOUCHER_TRANSACTION_TYPE.Bank) {

      let paymentVoucherFound = this.paymentVoucherDetailList.find(x => x.CreditAmount > 0);
      if (paymentVoucherFound) {

        this.frmGrpChildForm.controls["BankAccountId"].setValue(paymentVoucherFound.PostingAccountsId);
      }
    }
  }

  // private setAccountsConfigurationValues(): void {
  //   
  //   // Assigining CashAccountsId / BankAccountsList$
  //   if (this.selectedTransactionType === this.VOUCHER_TRANSACTION_TYPE.Cash) {

  //     this.cashAccountId = this.configurationSettingList?.find(d => d.AccountName === "CashAccount")?.AccountValue ?? 0;
  //   }
  //   else if (this.selectedTransactionType === this.VOUCHER_TRANSACTION_TYPE.Bank) {

  //     this.bankAccountId = this.configurationSettingList?.find(d => d.AccountName === "Banks")?.AccountValue ?? 0;

  //     if (this.bankAccountId > 0) {

  //       this.bankAccountsList = this._postingAccountsQuery.getAllPostingAccountsList;
  //     }
  //     else {
  //       this.bankAccountsList = [];
  //     }
  //   }
  //   //

  //   // Warning Messages For Accounts Configuration
  //   this.warningTransactionTypes.emit(this.getTransactionTypeError());
  //   //
  // }

  private getTransactionTypeError(): VOUCHER_TRANSACTION_TYPE {

    if (this.selectedTransactionType === this.VOUCHER_TRANSACTION_TYPE.Cash
      && !(this.cashAccountId > 0)) {

      return this.VOUCHER_TRANSACTION_TYPE.Cash;
    }
    else if (this.selectedTransactionType === this.VOUCHER_TRANSACTION_TYPE.Bank
      && !(this.bankAccountId > 0)) {

      return this.VOUCHER_TRANSACTION_TYPE.Bank;
    }
    else {
      return this.VOUCHER_TRANSACTION_TYPE.None;
    }
  }

  private assignLocalFormGroupValues(): void {
    this.frmGrpChildForm = this.paymentVoucherForm.controls['childForm'] as FormGroup;
    this.frmCtrlTotalDebitAmount = this.paymentVoucherForm.controls['TotalDebitAmount'] as FormControl;
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
    this.frmCtrlTotalDebitAmount
      .valueChanges
      .pipe
      (
        tap((totalDebitAmount: any) => {

          if (totalDebitAmount && this.totalCreditAmount
            && totalDebitAmount == this.totalCreditAmount) {

            this.totalAmount.emit(totalDebitAmount);
          }
          else {
            this.totalAmount.emit(0);
          }
        })
      ).subscribe();
    // 

    // Update TotalAmount on ParentForm on Control Value Changes => {DebitAmount => (frmGrpChildForm)}
    this.frmGrpChildForm
      .controls["DebitAmount"]
      .valueChanges
      .pipe
      (
        tap(debitAmount => this.updateTotalDebitAmount())
      ).subscribe();
    // 
  }

  private initialDataServiceCalls(): void {

    if (!this._postingAccountsQuery.hasEntity()) {
      this._dVal.assignFormValuesToObject(this.paymentVoucherForm, this.accountHeadsFilterRequest);
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

    this.paymentVoucherForm = this._formBuilder
      .group({

        OrganizationId: [this._authQuery.OrganizationId, [Validators.required]],
        OutletId: [this._authQuery.OutletId, [Validators.required]],
        TotalDebitAmount: [0, []],

        // Child Form Controls => {CashForm}
        childForm: this.selectedTransactionType == this.VOUCHER_TRANSACTION_TYPE.Cash ? this.buildCashForm() : this.buildBankForm()
        //                
      });
  }

  private buildCashForm(): FormGroup {
    // Child Form Controls => {CashForm}
    return this._formBuilder
      .group({
        PostingAccountsId: [0, [Validators.required, Validators.min(1)]],
        BankAccountId: [0, []],
        ChequeNo: ["", []],
        ChequeStatus: [false, []],
        ChequeDate: [null, []],
        TransactionType: [VOUCHER_TRANSACTION_TYPE.Cash, [Validators.required]],
        CreditAmount: [0, [Validators.required]],
        DebitAmount: [0, [Validators.required]],
      });
    //
  }

  private buildBankForm(): FormGroup {
    // Child Form Controls => {BankForm}
    return this._formBuilder
      .group({
        PostingAccountsId: [0, [Validators.required, Validators.min(1)]],
        BankAccountId: [0, [Validators.required, Validators.min(1)]], // PostingAccountsId for bankList
        ChequeNo: ["", []],
        ChequeStatus: [false, [Validators.required]],
        ChequeDate: [new Date(), [Validators.required]],
        TransactionType: [VOUCHER_TRANSACTION_TYPE.Bank, [Validators.required]],
        CreditAmount: [0, [Validators.required]],
        DebitAmount: [0, [Validators.required]],
      });
    //
  }
}
