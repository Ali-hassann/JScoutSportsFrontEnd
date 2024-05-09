import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs/operators';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AccountHeadsFilterRequest } from 'src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model';
import { PostingAccountsResponse } from 'src/app/modules/accounts/charts-of-accounts/models/posting-accounts.model';
import { PostingAccountsQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/posting-account.query';
import { VOUCHER_TRANSACTION_TYPE } from 'src/app/shared/enums/voucher.enum';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { VoucherMasterList, VouchersDetailRequest, VouchersMasterRequest } from '../../../models/voucher.model';
import { ConfigurationSetting } from 'src/app/modules/accounts/accounts-configuration/models/configuration-setting.model';
import { ConfigurationSettingQuery } from 'src/app/modules/accounts/accounts-configuration/states/data-states/accounts-configuration.query';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';

@Component({
  selector: 'app-receipt-voucher',
  templateUrl: './receipt-voucher.component.html',
  styleUrls: ['./receipt-voucher.component.scss']
})
export class ReceiptVoucherComponent implements OnInit {

  // Input and Output Decorator
  @Input() public isSaveButtonClicked: boolean = false;
  @Input() public isDataSaved: boolean = false;
  @Input() public receiptVoucherDetailList: VouchersDetailRequest[] = [];

  @Output() public voucherChildRequest: EventEmitter<VouchersDetailRequest[]> = new EventEmitter<VouchersDetailRequest[]>();
  @Output() public totalAmount: EventEmitter<number> = new EventEmitter<number>();
  @Output() public warningTransactionTypes: EventEmitter<string> = new EventEmitter<string>();
  //

  public postingAccountsList: PostingAccountsResponse[] = [];
  public bankAccountsList: PostingAccountsResponse[] = []; // Filtered by BankAccountsId from Posting Accounts List
  public voucherDetailRequest: VouchersDetailRequest = new VouchersDetailRequest();
  public accountHeadsFilterRequest: AccountHeadsFilterRequest = new AccountHeadsFilterRequest();
  public voucherMasterRequest: VouchersMasterRequest[] = [];
  public voucherMasterList: VoucherMasterList[] = [];
  public configurationSettingList: ConfigurationSetting[] = [];

  public voucherTransactionType = VOUCHER_TRANSACTION_TYPE;

  public transactionTypes: string[] = [
    VOUCHER_TRANSACTION_TYPE.Cash
  ];

  public transactionTypesFormat: string[] = [
    VOUCHER_TRANSACTION_TYPE.Cash
    , VOUCHER_TRANSACTION_TYPE.Bank
    , VOUCHER_TRANSACTION_TYPE.CreditCard
  ];

  public totalDebitAmount: number = 0;
  public totalCreditAmount: number = 0;
  public cashAccountId: number = 0; // For Double Entry
  public bankAccountId: number = 0; // SubCategoryId for Filtering PostingAccounts from => (postingAccountsList$)
  public tabViewIndex: number = 0;

  public isAmountValid: boolean = false;
  public isToDisableCash: boolean = true;
  public isToDisableBank: boolean = false;
  public isToDisableCreditCard: boolean = false;

  public datePickerFormat = DateHelperService.datePickerFormat;

  // Parent and Child FormGroup
  public receiptVoucherForm: FormGroup | any;

  public frmGrpCashForm: FormGroup | any;
  public frmGrpBankForm: FormGroup | any;
  public frmGrpCreditCardForm: FormGroup | any;

  public frmCtrlTotalCreditAmount: FormControl | any;
  //

  public status = [
    { name: 'Paid', code: true },
    { name: 'Unpaid', code: true },
  ];

  constructor(
    private _formBuilder: FormBuilder
    , private _dVal: DomainValidatorsService
    , private _postingAccountsQuery: PostingAccountsQuery
    , private _authQuery: AuthQuery
    , private _messageService: MessageService
    , private _accountsConfiQuery: ConfigurationSettingQuery
  ) {
  }

  public ngOnInit(): void {
    this.inializeConfiguration();
    this.setInititalFormState();
    this.initialDataServiceCalls();
  }

  public ngOnChanges(parentFormChanges: SimpleChanges | any): void {

    setTimeout(() => {

      if (parentFormChanges?.isSaveButtonClicked?.currentValue ?? false) {

        if (this.validationBeforeSaving()) {

          this.addReceiptVoucherDetail();

          if (this.isAmountValid) {
            this.voucherChildRequest.emit(this.receiptVoucherDetailList);
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
      else if (parentFormChanges?.receiptVoucherDetailList?.currentValue?.length > 0) {

        this.changeSelectedTransactionType();
        this.setInititalFormState();
        this.assignVoucherDetailToFormControls();
        this.assignAccountsConfigurationToFormControls();
        this.checkBoxValidation(this.transactionTypes);
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

  public onVoucherTypeCheckBoxChange(
    event: any
    , index: number
    , selectedType: VOUCHER_TRANSACTION_TYPE
  ): void {

    if (event?.checked?.length > 0) {

      this.checkBoxValidation(event.checked);
      this.setActiveTab(selectedType, index);

      // // Setting PostingAccountsId from accounts configuration
      // this.setAccountsConfigurationValues();
      // //
    }

    // Update Total Credit Amount
    this.updateTotalCreditAmount();
    //
  }

  private assignLocalFormGroupValues(): void {

    this.frmGrpCashForm = this.receiptVoucherForm.controls['cashForm'] as FormGroup;
    this.frmGrpBankForm = this.receiptVoucherForm.controls['bankForm'] as FormGroup;
    this.frmGrpCreditCardForm = this.receiptVoucherForm.controls['creditCardForm'] as FormGroup;

    this.frmCtrlTotalCreditAmount = this.receiptVoucherForm.controls['TotalCreditAmount'] as FormControl;
  }

  private changeSelectedTransactionType(): void {

    this.transactionTypes = [];

    this.receiptVoucherDetailList
      ?.filter(x => x.CreditAmount > 0)
      ?.forEach(receiptVoucherDetail => {

        if (this.voucherTransactionType.Cash == receiptVoucherDetail.TransactionType) {

          this.transactionTypes.push(this.voucherTransactionType.Cash);
        }
        else if (this.voucherTransactionType.Bank == receiptVoucherDetail.TransactionType) {

          this.transactionTypes.push(this.voucherTransactionType.Bank);
        }
        else if (this.voucherTransactionType.CreditCard == receiptVoucherDetail.TransactionType) {

          this.transactionTypes.push(this.voucherTransactionType.CreditCard);
        }
      });
  }

  private assignVoucherDetailToFormControls(): void {
    this.receiptVoucherDetailList
      ?.filter(x => x.CreditAmount > 0)
      ?.forEach((receiptVoucherDetail: any) => {
        if (this.voucherTransactionType.Cash == receiptVoucherDetail.TransactionType) {
          this._dVal.assignObjectValuesToForm(this.frmGrpCashForm, receiptVoucherDetail);
          this.frmGrpCashForm.controls["ChequeDate"].setValue(DateHelperService.getDatePickerFormat(receiptVoucherDetail.ChequeDate));
        }
        else if (this.voucherTransactionType.Bank == receiptVoucherDetail.TransactionType) {

          this._dVal.assignObjectValuesToForm(this.frmGrpBankForm, receiptVoucherDetail);
          this.frmGrpBankForm.controls["ChequeDate"].setValue(DateHelperService.getDatePickerFormat(receiptVoucherDetail.ChequeDate));
        }
        else if (this.voucherTransactionType.CreditCard == receiptVoucherDetail.TransactionType) {

          this._dVal.assignObjectValuesToForm(this.frmGrpCreditCardForm, receiptVoucherDetail);
          this.frmGrpCreditCardForm.controls["ChequeDate"].setValue(DateHelperService.getDatePickerFormat(receiptVoucherDetail.ChequeDate));
        }

        this.receiptVoucherForm.controls["PostingAccountsId"].setValue(receiptVoucherDetail.PostingAccountsId);
      });
  }

  private addReceiptVoucherDetail(): void {

    this.receiptVoucherDetailList = [];

    if (this.frmGrpCashForm.invalid || this.frmGrpBankForm.invalid || this.frmGrpCreditCardForm.invalid) {
      this.receiptVoucherForm.markAllAsTouched();
    }

    if (this.transactionTypes.includes(this.voucherTransactionType.Cash)) {

      this.voucherDetailRequest = new VouchersDetailRequest();

      // Creating First Entry for PostingAccounts => {CreditAmount}
      this._dVal.assignFormValuesToObject(this.frmGrpCashForm, this.voucherDetailRequest);
      this.voucherDetailRequest.ChequeDate = this.getFormatDateForVoucherDetail(this.voucherTransactionType.Cash, this.voucherDetailRequest.ChequeDate);
      this.voucherDetailRequest.PostingAccountsId = this.receiptVoucherForm.controls["PostingAccountsId"].value as number;
      this.receiptVoucherDetailList.push(this.voucherDetailRequest);
      //      

      // Creating Second Entry for PostingACcounts => {DebitAmount}
      this.addVoucherDetailForDebitAmount(this.voucherTransactionType.Cash);
      //      
    }

    if (this.transactionTypes.includes(this.voucherTransactionType.Bank)) {

      this.voucherDetailRequest = new VouchersDetailRequest();

      // Creating First Entry for PostingAccounts => {CreditAmount}
      this._dVal.assignFormValuesToObject(this.frmGrpBankForm, this.voucherDetailRequest);
      this.voucherDetailRequest.ChequeDate = this.getFormatDateForVoucherDetail(this.voucherTransactionType.Bank, this.voucherDetailRequest.ChequeDate);
      this.voucherDetailRequest.PostingAccountsId = this.receiptVoucherForm.controls["PostingAccountsId"].value as number;
      this.receiptVoucherDetailList.push(this.voucherDetailRequest);
      //      

      // Creating Second Entry for PostingACcounts => {DebitAmount}
      this.addVoucherDetailForDebitAmount(this.voucherTransactionType.Bank);
      // 
    }

    if (this.transactionTypes.includes(VOUCHER_TRANSACTION_TYPE.CreditCard)) {

      this.voucherDetailRequest = new VouchersDetailRequest();

      // Creating First Entry for PostingAccounts => {CreditAmount}
      this._dVal.assignFormValuesToObject(this.frmGrpCreditCardForm, this.voucherDetailRequest);
      this.voucherDetailRequest.ChequeDate = this.getFormatDateForVoucherDetail(this.voucherTransactionType.CreditCard, this.voucherDetailRequest.ChequeDate);
      this.voucherDetailRequest.PostingAccountsId = this.receiptVoucherForm.controls["PostingAccountsId"].value as number;
      this.receiptVoucherDetailList.push(this.voucherDetailRequest);
      //      

      // Creating Second Entry for PostingACcounts => {DebitAmount}
      this.addVoucherDetailForDebitAmount(this.voucherTransactionType.CreditCard);
      // 
    }
  }

  private addVoucherDetailForDebitAmount(voucherTransactionType: string): void {

    let voucherDetailRequest = new VouchersDetailRequest();

    voucherDetailRequest.TransactionType = voucherTransactionType;
    voucherDetailRequest.DebitAmount = this.voucherDetailRequest.CreditAmount;
    voucherDetailRequest.CreditAmount = 0;
    voucherDetailRequest.ChequeNo = this.voucherDetailRequest.ChequeNo;
    voucherDetailRequest.ChequeStatus = this.voucherDetailRequest.ChequeStatus;
    // Setting Cash/Bank Account 
    if (voucherTransactionType == this.voucherTransactionType.Cash) {

      voucherDetailRequest.ChequeDate = "";
      voucherDetailRequest.PostingAccountsId = this.cashAccountId;
    }
    else if (voucherTransactionType == this.voucherTransactionType.Bank) {

      voucherDetailRequest.ChequeDate = this.getFormatDateForVoucherDetail(voucherTransactionType, this.voucherDetailRequest.ChequeDate);
      voucherDetailRequest.PostingAccountsId = this.frmGrpBankForm.controls["BankAccountId"].value as number;
    }
    else if (voucherTransactionType == this.voucherTransactionType.CreditCard) {

      voucherDetailRequest.ChequeDate = "";
      voucherDetailRequest.PostingAccountsId = this.frmGrpCreditCardForm.controls["BankAccountId"].value as number;
    }
    //

    this.receiptVoucherDetailList.push(voucherDetailRequest);

    // Update Total Credit Amount
    this.updateTotalCreditAmount();
    //
  }

  private getFormatDateForVoucherDetail(
    voucherTransactionType: VOUCHER_TRANSACTION_TYPE
    , dateToConvert?: Date | string
  ): Date | string | any {

    if (voucherTransactionType === this.voucherTransactionType.Bank) {

      return DateHelperService.getServerDateFormat(dateToConvert);
    }

    return null;
  }

  private setActiveTab(
    selectedType: VOUCHER_TRANSACTION_TYPE
    , index: number
  ): void {

    let transactionTypes = this.transactionTypes;
    this.transactionTypes = [];

    this.transactionTypesFormat
      .forEach(x => {

        if (transactionTypes.includes(x)) {
          this.transactionTypes.push(x);
        }
      });

    setTimeout(e => {
      this.transactionTypes.includes(selectedType)
        ? this.tabViewIndex = index
        : this.tabViewIndex = 0;
    }, 200, index, selectedType);

  }

  private checkBoxValidation(selectedVoucherTypes: any): void {

    if (selectedVoucherTypes?.length > 0) {

      if (selectedVoucherTypes.length > 1) {

        this.isToDisableCash = false;
        this.isToDisableBank = false;
        this.isToDisableCreditCard = false;
      }
      else if (selectedVoucherTypes.includes(this.voucherTransactionType.Cash)) {
        this.isToDisableCash = true;
      }
      else if (selectedVoucherTypes.includes(this.voucherTransactionType.Bank)) {
        this.isToDisableBank = true;
      }
      else if (selectedVoucherTypes.includes(this.voucherTransactionType.CreditCard)) {
        this.isToDisableCreditCard = true;
      }
    }
  }

  private validationBeforeSaving(): boolean {
    if (this.receiptVoucherForm.controls["PostingAccountsId"].invalid) {

      this.receiptVoucherForm.markAllAsTouched();
      this.voucherChildRequest.emit([]);
      return false;
    }

    if (this.transactionTypes.includes(this.voucherTransactionType.Cash)) {

      if (this.frmGrpCashForm.invalid) {

        this.frmGrpCashForm.markAllAsTouched();
        this.voucherChildRequest.emit([]);
        return false;
      }
    }

    if (this.transactionTypes.includes(this.voucherTransactionType.Bank)) {

      if (this.frmGrpBankForm.invalid) {

        this.frmGrpBankForm.markAllAsTouched();
        this.voucherChildRequest.emit([]);
        return false;
      }
    }

    if (this.transactionTypes.includes(this.voucherTransactionType.CreditCard)) {

      if (this.frmGrpCreditCardForm.invalid) {

        this.frmGrpCreditCardForm.markAllAsTouched();
        this.voucherChildRequest.emit([]);
        return false;
      }
    }

    if (!this.configurationSettingList) {

      this.showToastMessage("First set your accounts configuration to add voucher.");
      this.voucherChildRequest.emit([]);
      return false;
    }

    let transactionTypeError = this.getTransactionTypeError();

    if (transactionTypeError?.length > 0
      && transactionTypeError != this.voucherTransactionType.None) {

      this.showToastMessage(`First set your ${transactionTypeError} account(s) to add ${transactionTypeError} entry(s).`);
      return false;
    }

    return true;
  }

  private getTransactionTypeError(): string {
    let transactionTypeError = "";

    if (this.transactionTypes.includes(this.voucherTransactionType.Cash)
      && !(this.cashAccountId > 0)) {

      transactionTypeError = `${transactionTypeError} ${this.voucherTransactionType.Cash},`;
    }

    if (this.transactionTypes.includes(this.voucherTransactionType.Bank)
      && !(this.bankAccountId > 0)) {

      transactionTypeError = `${transactionTypeError} ${this.voucherTransactionType.Bank},`;
    }

    if (this.transactionTypes.includes(this.voucherTransactionType.CreditCard)
      && !(this.bankAccountId > 0)) {

      transactionTypeError = `${transactionTypeError} ${this.voucherTransactionType.CreditCard},`;
    }

    return transactionTypeError == ""
      ? VOUCHER_TRANSACTION_TYPE.None
      : transactionTypeError?.trim()?.slice(0, -1);
  }

  private updateTotalCreditAmount(): void {

    this.totalCreditAmount = 0;
    this.totalDebitAmount = 0;

    if (this.transactionTypes.includes(this.voucherTransactionType.Cash)) {

      this.totalCreditAmount += this.frmGrpCashForm.controls["CreditAmount"].value as number;
    }

    if (this.transactionTypes.includes(this.voucherTransactionType.Bank)) {

      this.totalCreditAmount += this.frmGrpBankForm.controls["CreditAmount"].value as number;
    }

    if (this.transactionTypes.includes(this.voucherTransactionType.CreditCard)) {

      this.totalCreditAmount += this.frmGrpCreditCardForm.controls["CreditAmount"].value as number;
    }

    this.totalDebitAmount = this.totalCreditAmount;

    this.isAmountValid =
      (
        this.totalDebitAmount > 0
        && this.totalCreditAmount > 0
        && this.totalDebitAmount == this.totalCreditAmount
      );

    this.frmCtrlTotalCreditAmount.setValue(this.totalDebitAmount);
  }

  private setInititalFormState(): void {

    this.assignDefaultFormValues();
    this.assignObservableValues();
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
    this.frmCtrlTotalCreditAmount
      .valueChanges
      .pipe
      (
        tap((totalCreditAmount: any) => {
          if (totalCreditAmount && this.totalDebitAmount
            && totalCreditAmount == this.totalDebitAmount) {

            this.totalAmount.emit(totalCreditAmount);
          }
          else {
            this.totalAmount.emit(0);
          }
        })
      ).subscribe();
    // 

    // Update TotalAmount on ParentForm on Control Value Changes => {CreditAmount => (frmGrpCashForm)}
    this.frmGrpCashForm
      .controls["CreditAmount"]
      .valueChanges
      .pipe
      (
        tap(creditAmount => this.updateTotalCreditAmount())
      ).subscribe();
    // 

    // Update TotalAmount on ParentForm on Control Value Changes => {CreditAmount => (frmGrpBankForm)}
    this.frmGrpBankForm
      .controls["CreditAmount"]
      .valueChanges
      .pipe
      (
        tap(creditAmount => this.updateTotalCreditAmount())
      ).subscribe();
    // 

    // Update TotalAmount on ParentForm on Control Value Changes => {CreditAmount => (frmGrpCreditCardForm)}
    this.frmGrpCreditCardForm
      .controls["CreditAmount"]
      .valueChanges
      .pipe
      (
        tap(creditAmount => this.updateTotalCreditAmount())
      ).subscribe();
    // 

    // // Assigning AccountsConfiguration Fields
    // let configExist =
    //   this._accountsConfiQuery
    //     .configurationSetting.findIndex(u => u.AccountName === "CashAccount" || u.AccountName === "Banks") > -1;
    // if (configExist) {
    //   // Setting PostingAccountsId from accounts configuration
    //   this.setAccountsConfigurationValues();
    //   //
    // }
  }

  private assignDefaultFormValues(): void {

    this.buildForm();
    this.assignLocalFormGroupValues();
  }

  private assignAccountsConfigurationToFormControls(): void {

    this.receiptVoucherDetailList
      ?.filter
      (
        x => x.DebitAmount > 0
          && x.TransactionType != this.voucherTransactionType.Cash
      )
      ?.forEach(receiptVoucherDetail => {

        if (receiptVoucherDetail) {

          if (this.transactionTypes.includes(this.voucherTransactionType.Bank)
            && this.voucherTransactionType.Bank == receiptVoucherDetail.TransactionType) {

            this.frmGrpBankForm.controls["BankAccountId"].setValue(receiptVoucherDetail.PostingAccountsId);
          }
          else if (this.transactionTypes.includes(this.voucherTransactionType.CreditCard)
            && this.voucherTransactionType.CreditCard == receiptVoucherDetail.TransactionType) {

            this.frmGrpCreditCardForm.controls["BankAccountId"].setValue(receiptVoucherDetail.PostingAccountsId);
          }
        }
      });
  }

  // private setAccountsConfigurationValues(): void {

  //   // Assigining CashAccountsId / BankAccountsList$
  //   if (this.transactionTypes.includes(this.voucherTransactionType.Cash)) {

  //     this.cashAccountId = this.configurationSettingList?.find(o => o.AccountName === "CashAccount")?.AccountValue ?? 0;
  //   }

  //   if (this.transactionTypes.includes(this.voucherTransactionType.Bank)
  //     || this.transactionTypes.includes(this.voucherTransactionType.CreditCard)) {

  //     this.bankAccountId = this.configurationSettingList?.find(o => o.AccountName === "Banks")?.AccountValue ?? 0;

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

  private initialDataServiceCalls(): void {

    if (!this._postingAccountsQuery.hasEntity()) {
      this._dVal.assignFormValuesToObject(this.receiptVoucherForm, this.accountHeadsFilterRequest);
    }
  }

  private showToastMessage(
    messageToShow: string = "Something went wrong"
    , messageType: string = "error")
    : void {

    this._messageService.add({
      severity: messageType,
      summary: messageType == "error" ? 'Error' : 'Successful',
      detail: messageToShow,
      life: 3000
    });
  }

  private buildForm(): void {
    this.receiptVoucherForm = this._formBuilder
      .group({

        OrganizationId: [this._authQuery.OrganizationId, [Validators.required]],
        OutletId: [this._authQuery.OutletId, [Validators.required]],
        PostingAccountsId: [0, [Validators.required, Validators.min(1)]],
        TotalCreditAmount: [0, []],

        // Child Form Controls => {CashForm}
        cashForm: this._formBuilder
          .group({
            PostingAccountsId: [0, []],
            BankAccountId: [0, []],
            CreditAmount: [0, [Validators.required, Validators.min(1)]],
            DebitAmount: [0, [Validators.required]],
            ChequeNo: ['', []],
            ChequeStatus: [false, [Validators.required]],
            ChequeDate: [null, []],
            TransactionType: [this.voucherTransactionType.Cash, [Validators.required]]
          }),
        //

        // Child Form Controls => {BankForm}
        bankForm: this._formBuilder
          .group({
            PostingAccountsId: [0, []],
            BankAccountId: [0, [Validators.required, Validators.min(1)]], // PostingAccountsId for bankList
            BankAccountReceipt: ['', []],
            ChequeNo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            ChequeStatus: [false, [Validators.required]],
            ChequeDate: [new Date(), [Validators.required]],
            TransactionType: [this.voucherTransactionType.Bank, [Validators.required]],
            CreditAmount: [0, [Validators.required, Validators.min(1)]],
            DebitAmount: [0, [Validators.required]]
          }),
        //

        // Child Form Controls => {CreditCardForm}
        creditCardForm: this._formBuilder
          .group({
            PostingAccountsId: [0, []],
            BankAccountId: [0, [Validators.required, Validators.min(1)]], // PostingAccountsId for bankList
            BankAccount: ['', []],
            ChequeNo: ['', []],
            ChequeStatus: [false, [Validators.required]],
            ChequeDate: [null, []],
            CreditAmount: [0, [Validators.required, Validators.min(1)]],
            DebitAmount: [0, [Validators.required]],
            TransactionType: [this.voucherTransactionType.CreditCard, [Validators.required]]
          })
        //
      });
  }
}
