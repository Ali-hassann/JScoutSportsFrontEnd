import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AccountHeadsFilterRequest } from 'src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model';
import { PostingAccountsResponse } from 'src/app/modules/accounts/charts-of-accounts/models/posting-accounts.model';
import { PostingAccountsQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/posting-account.query';
import { TRANSACTION_TYPE, VOUCHER_TRANSACTION_TYPE } from 'src/app/shared/enums/voucher.enum';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { VouchersDetailRequest } from '../../../models/voucher.model';
import { ConfigurationSettingQuery } from 'src/app/modules/accounts/accounts-configuration/states/data-states/accounts-configuration.query';

@Component({
  selector: 'app-multi-cash-payment-voucher',
  templateUrl: './multi-cash-payment-voucher.component.html',
  styleUrls: ['./multi-cash-payment-voucher.component.scss']
})
export class MultiCashPaymentVoucherComponent
  implements OnInit, OnChanges {

  // Parent Child Decorators
  @Input() public isSaveButtonClicked: boolean = false;
  @Input() public isDataSaved: boolean = false;
  @Input() public isUpdateCase: boolean = false;
  @Input() public multiPaymentVoucherDetailList: VouchersDetailRequest[] = [];

  @Output() public voucherChildRequest: EventEmitter<VouchersDetailRequest[]> = new EventEmitter<VouchersDetailRequest[]>();
  @Output() public totalAmount: EventEmitter<number> = new EventEmitter<number>();
  @Output() public warningTransactionTypes: EventEmitter<string> = new EventEmitter<string>();
  //

  public postingAccountsList: PostingAccountsResponse[] = [];
  public postingAccountsRequest: PostingAccountsResponse = new PostingAccountsResponse();
  public bankReceiptVoucherDetailRequest: VouchersDetailRequest = new VouchersDetailRequest();
  public accountHeadsFilterRequest: AccountHeadsFilterRequest = new AccountHeadsFilterRequest();

  public totalDebitAmount: number = 0;
  public totalCreditAmount: number = 0;

  public isAmountValid: boolean = true;
  total: number = 0;
  cashAccountId = 0;

  constructor(
    private _dVal: DomainValidatorsService
    , private _postingAccountsQuery: PostingAccountsQuery
    , private _authQuery: AuthQuery
    , private _messageService: MessageService
    , private _configurationSettingQuery: ConfigurationSettingQuery
  ) {

  }

  public ngOnInit(): void {
    this.cashAccountId = this._configurationSettingQuery.getAllConfigurationList()?.find(x => x.AccountName === "CashAccount")?.AccountValue ?? 0;
    this.setInititalFormState();

    this.warningTransactionTypes.emit(VOUCHER_TRANSACTION_TYPE.None);
  }

  public ngOnChanges(parentFormChanges: SimpleChanges | any): void {
    setTimeout(() => {
      if (parentFormChanges?.isSaveButtonClicked?.currentValue ?? false) {

        if (this.isAmountValid) {
          if (this.isUpdateCase) {
            this.voucherChildRequest.emit(this.multiPaymentVoucherDetailList);
          }
          // else if () {

          this.voucherChildRequest.emit(this.multiPaymentVoucherDetailList);

          // }
          // else {
          //   this.bankReceiptVoucherForm.markAllAsTouched();
          //   this.showToastMessage("Enter Valid Data !!");
          // }
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

  setPostingAccount() {
    this.bankReceiptVoucherDetailRequest.PostingAccountsId = this.postingAccountsRequest.PostingAccountsId;
    this.bankReceiptVoucherDetailRequest.PostingAccountsName = this.postingAccountsRequest.PostingAccountsName;
  }

  public addBankReceiptVoucherDetail(): void {
    if (this.bankReceiptVoucherDetailRequest.PostingAccountsId > 0 &&
      this.cashAccountId > 0 &&
      this.bankReceiptVoucherDetailRequest.DebitAmount > 0) {

      this.bankReceiptVoucherDetailRequest.TransactionType = TRANSACTION_TYPE.Cash;
      this.multiPaymentVoucherDetailList.unshift(this.bankReceiptVoucherDetailRequest);

      // add cash credit detail
      let indexAlreadyExist = this.multiPaymentVoucherDetailList.findIndex(v => v.PostingAccountsId === this.cashAccountId);
      if (indexAlreadyExist > -1) {
        this.multiPaymentVoucherDetailList[indexAlreadyExist].CreditAmount += this.bankReceiptVoucherDetailRequest.DebitAmount;
      } else {
        let cashDetail = new VouchersDetailRequest();
        cashDetail.CreditAmount = this.bankReceiptVoucherDetailRequest.DebitAmount;
        cashDetail.DebitAmount = 0;
        cashDetail.PostingAccountsId = this.cashAccountId;
        cashDetail.TransactionType = TRANSACTION_TYPE.Cash;
        this.multiPaymentVoucherDetailList.unshift(cashDetail);
      }

      //

      this.bankReceiptVoucherDetailRequest = new VouchersDetailRequest();

      // Update Credit/Debit Amount Summary
      this.updateFooterSummary();
      //
    }
  }

  public deleteJournalVoucherDetail(rowIndex: number): void {

    if (rowIndex > -1
      && this.multiPaymentVoucherDetailList?.length > 0
      && rowIndex >= 0
      && (rowIndex + 1) <= this.multiPaymentVoucherDetailList.length) {

      this.multiPaymentVoucherDetailList.splice(rowIndex, 1);

      // Update Credit/Debit Amount Summary
      this.updateFooterSummary();
      //
    }
  }

  public onDebitAmountChange(event: any): void {
    if (event?.target?.value > 0) {
      this.bankReceiptVoucherDetailRequest.CreditAmount = 0;
    }
    else {
      this.bankReceiptVoucherDetailRequest.DebitAmount = 0;
    }
  }

  public onRowEditSave(voucherDetail: VouchersDetailRequest, event: any) {
    if (event?.key == "Enter"
      || event?.key == "Tab"
      || event?.type == "focusout") {
      voucherDetail.CreditAmount = 0;
      this.updateFooterSummary();
    }
  }

  private setInititalFormState(): void {
    this.multiPaymentVoucherDetailList = [];
    this.assignObservableValues();
    this.updateFooterSummary();
  }

  private updateFooterSummary(): void {

    this.totalDebitAmount = 0;
    this.totalCreditAmount = 0;
    this.multiPaymentVoucherDetailList
      ?.forEach(voucherDetail => {
        this.totalDebitAmount += voucherDetail.DebitAmount;
        this.totalCreditAmount += voucherDetail.CreditAmount;
        if (this.totalCreditAmount > 0 && this.totalCreditAmount > 0 && this.totalDebitAmount == this.totalCreditAmount) {
          this.total = this.totalDebitAmount;
          this.totalAmount.emit(this.totalDebitAmount);
        }
      })
    if (this.multiPaymentVoucherDetailList.length > 0) {
      this.isAmountValid =
        (
          this.totalDebitAmount > 0
          && this.totalCreditAmount > 0
          && this.totalDebitAmount == this.totalCreditAmount
        );
    }
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

    this.totalAmount.emit(this.totalDebitAmount);
    //
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

  // private buildForm(): void {
  //   this.bankReceiptVoucherForm = this._formBuilder
  //     .group
  //     ({
  //       OrganizationId: [this._authQuery.OrganizationId, [Validators.required]],
  //       OutletId: [this._authQuery.OutletId, [Validators.required]],
  //       VouchersDetailId: [0, [Validators.required]],
  //       PostingAccountsId: [0, []],
  //       PostingAccountsName: ["", []],
  //       Narration: ["", []],
  //       DebitAmount: [0, [Validators.required]],
  //       CreditAmount: [0, [Validators.required]],
  //       VouchersMasterId: [0, [Validators.required]],
  //       TransactionType: [VOUCHER_TRANSACTION_TYPE.Bank, [Validators.required]],
  //       IsDebitAmountValid: [true, []],
  //       IsCreditAmountValid: [true, []],
  //       TotalDebitAmount: [0, []]
  //     });
  // }
}