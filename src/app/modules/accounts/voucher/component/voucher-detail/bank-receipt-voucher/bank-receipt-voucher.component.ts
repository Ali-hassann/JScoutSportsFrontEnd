import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs/operators';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { AccountHeadsFilterRequest } from 'src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model';
import { PostingAccountsResponse } from 'src/app/modules/accounts/charts-of-accounts/models/posting-accounts.model';
import { PostingAccountsQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/posting-account.query';
import { TRANSACTION_TYPE, VOUCHER_TRANSACTION_TYPE } from 'src/app/shared/enums/voucher.enum';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { VouchersDetailRequest } from '../../../models/voucher.model';

@Component({
  selector: 'app-bank-receipt-voucher',
  templateUrl: './bank-receipt-voucher.component.html',
  styleUrls: ['./bank-receipt-voucher.component.scss']
})
export class BankJournalVoucherComponent
  implements OnInit, OnChanges {

  // Parent Child Decorators
  @Input() public isSaveButtonClicked: boolean = false;
  @Input() public isDataSaved: boolean = false;
  @Input() public isUpdateCase: boolean = false;
  @Input() public bankReceiptVoucherDetailList: VouchersDetailRequest[] = [];

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

  constructor(
    private _dVal: DomainValidatorsService
    , private _postingAccountsQuery: PostingAccountsQuery
    , private _authQuery: AuthQuery
    , private _messageService: MessageService
  ) {

  }

  public ngOnInit(): void {
    this.setInititalFormState();

    this.warningTransactionTypes.emit(VOUCHER_TRANSACTION_TYPE.None);
  }

  public ngOnChanges(parentFormChanges: SimpleChanges | any): void {
    setTimeout(() => {
      if (parentFormChanges?.isSaveButtonClicked?.currentValue ?? false) {

        if (this.isAmountValid) {
          if (this.isUpdateCase) {
            this.voucherChildRequest.emit(this.bankReceiptVoucherDetailList);
          }
          // else if () {

          this.voucherChildRequest.emit(this.bankReceiptVoucherDetailList);

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
      (this.bankReceiptVoucherDetailRequest.DebitAmount > 0 || this.bankReceiptVoucherDetailRequest.CreditAmount > 0)
    ) {
      this.bankReceiptVoucherDetailRequest.TransactionType = TRANSACTION_TYPE.Bank;
      this.bankReceiptVoucherDetailList.unshift(this.bankReceiptVoucherDetailRequest);
      this.bankReceiptVoucherDetailRequest = new VouchersDetailRequest();

      // Update Credit/Debit Amount Summary
      this.updateFooterSummary();
      //
    }
  }

  public deleteJournalVoucherDetail(rowIndex: number): void {

    if (rowIndex > -1
      && this.bankReceiptVoucherDetailList?.length > 0
      && rowIndex >= 0
      && (rowIndex + 1) <= this.bankReceiptVoucherDetailList.length) {

      this.bankReceiptVoucherDetailList.splice(rowIndex, 1);

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

  public onCreditAmountChange(event: any): void {
    if (event?.target?.value > 0) {
      this.bankReceiptVoucherDetailRequest.DebitAmount = 0;
    }
    else {
      this.bankReceiptVoucherDetailRequest.CreditAmount = 0;
    }
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
    this.bankReceiptVoucherDetailList = [];
    this.assignObservableValues();
    this.updateFooterSummary();
  }

  private updateFooterSummary(): void {

    this.totalDebitAmount = 0;
    this.totalCreditAmount = 0;
    this.bankReceiptVoucherDetailList
      ?.forEach(voucherDetail => {
        this.totalDebitAmount += voucherDetail.DebitAmount;
        this.totalCreditAmount += voucherDetail.CreditAmount;
        if (this.totalCreditAmount > 0 && this.totalCreditAmount > 0 && this.totalDebitAmount == this.totalCreditAmount) {
          this.total = this.totalDebitAmount;
          this.totalAmount.emit(this.totalDebitAmount);
        }
      })
    if (this.bankReceiptVoucherDetailList.length > 0) {
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