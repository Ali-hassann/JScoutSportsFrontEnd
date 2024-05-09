import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityStateHistoryPlugin } from '@datorama/akita';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map } from 'rxjs/operators';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { PostingAccountsResponse } from '../../../models/posting-accounts.model';
import { SubCategoriesResponse } from '../../../models/sub-category.model';
import { PostingAccountsService } from '../../../services/posting-accounts.service';
import { PostingAccountsQuery } from '../../../states/data-state/posting-account.query';
import { SubCategoryQuery } from '../../../states/data-state/sub-category.query';
import { AddSubCategoryComponent } from '../../sub-category/add-sub-category/add-sub-category.component';

@Component({
  selector: 'app-add-posting-accounts',
  templateUrl: './add-posting-accounts.component.html',
  styleUrls: ['./add-posting-accounts.component.scss']
})
export class AddPostingAccountsComponent implements OnInit {

  public postingAccountFormData: PostingAccountsResponse = new PostingAccountsResponse();

  public addPostingAccountForm: FormGroup | any;
  public postingAccountStateHistory: EntityStateHistoryPlugin | any;

  public datePickerFormat = DateHelperService.datePickerFormat;

  public subCategoryDropDownList: SubCategoriesResponse[] = []
  constructor(
    private _formBuilder: FormBuilder,
    private _dval: DomainValidatorsService,
    private _postingAccountsService: PostingAccountsService,
    public config: DynamicDialogConfig,
    private _subCategoryQuery: SubCategoryQuery,
    private _postingAccountQuery: PostingAccountsQuery,
    private _dialogService: DialogService,
    private _messageService: MessageService,
    private _authQuery: AuthQuery,
    private ref: DynamicDialogRef,
  ) {
  }

  public ngOnInit(): void {
    this.postingAccountStateHistory = new EntityStateHistoryPlugin(this._postingAccountQuery);
    this._subCategoryQuery.subCategoryList$.subscribe(
      (x: any) => {
        this.subCategoryDropDownList = x;
      }
    );
    this.buildForm();
    this.assignValueToDropdownlist();
    this.onTypeChange();
  }
  private assignValueToDropdownlist() {
    if (this.config?.data) {
      this._dval.assignObjectValuesToForm(this.addPostingAccountForm, this.config.data);
      this.addPostingAccountForm.controls['Name'].setValue(this.config.data.PostingAccountsName);
      this.addPostingAccountForm.controls['IsActive'].setValue(this.config.data.IsActive);

      this.addPostingAccountForm.controls['OpeningDate'].setValue(DateHelperService.getDatePickerFormat(this.config.data.OpeningDate));
    }
    if (this.addPostingAccountForm.controls['OpeningCredit'].value > 0) {
      this.addPostingAccountForm.controls['OpeningDebit'].setValue(0);
      this.addPostingAccountForm.controls['OpeningDebit'].disable();
      this.addPostingAccountForm.controls['OpeningCredit'].enable();
      this.addPostingAccountForm.controls['IsCredit'].setValue(true);
    }
    else {
      this.addPostingAccountForm.controls['OpeningCredit'].setValue(0);
      this.addPostingAccountForm.controls['OpeningCredit'].disable();
      this.addPostingAccountForm.controls['OpeningDebit'].enable();
      this.addPostingAccountForm.controls['IsCredit'].setValue(false);

    }
  }
  public onSubCategoryChange(event: any) {
    if (event) {
      this.addPostingAccountForm.controls['SubCategoriesId'].setValue(event.value);
      this.focusOnInput('NameField');
    }
  }

  addSubCategory() {
    let dialogRef = this._dialogService.open(AddSubCategoryComponent, {
      header: 'Add Sub Category',
      data: null,
      width: '35%'
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.assignValueToDropdownlist();
      }
    });
  }

  public onTypeChange() {
    this.addPostingAccountForm.controls['IsCredit'].valueChanges.subscribe((x: any) => {
      if (x) {
        this.addPostingAccountForm.controls['OpeningDebit'].setValue(0);
        this.addPostingAccountForm.controls['OpeningDebit'].disable();
        this.addPostingAccountForm.controls['OpeningCredit'].enable();
      }
      else {
        this.addPostingAccountForm.controls['OpeningCredit'].setValue(0);
        this.addPostingAccountForm.controls['OpeningCredit'].disable();
        this.addPostingAccountForm.controls['OpeningDebit'].enable();

      }
    })
  }

  public addPostingAccount(): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Posting account is being added', sticky: true });
    this._dval.assignFormValuesToObject(this.addPostingAccountForm, this.postingAccountFormData);
    this.postingAccountFormData.OpeningDate = DateHelperService.getServerDateFormat(this.postingAccountFormData.OpeningDate);
    this._postingAccountQuery.addPostingAccount(this.postingAccountFormData);

    this._postingAccountsService.addPostingAccount(this.postingAccountFormData).pipe(map(response => {
      if (response) {
        this._messageService.clear();
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Posting account added successfully', life: 3000 });
        this._postingAccountQuery.removePostingAccount(0);
        this._postingAccountQuery.addPostingAccount(response);
        this.addPostingAccountForm.controls['OpeningDebit'].setValue(0);
        this.addPostingAccountForm.controls['OpeningCredit'].setValue(0);
      }
    }, (error: any) => {
      this.postingAccountStateHistory.undo();
      this._messageService.clear();
      this._messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'An error occurred. Please try again later.',
        life: 3000
      });
    })).subscribe();
    this._postingAccountQuery.addPostingAccount(this.postingAccountFormData);

    this.clearEntiriesForAddMultiRecord();
    this.focusOnInput('NameField');
  }

  public updatePostingAccount(): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Posting account is being updated', sticky: true });
    this._dval.assignFormValuesToObject(this.addPostingAccountForm, this.postingAccountFormData);
    this.postingAccountFormData.OpeningDate = DateHelperService.getServerDateFormat(this.postingAccountFormData.OpeningDate);
    this._postingAccountQuery.updatePostingAccount(this.postingAccountFormData);

    this._postingAccountsService.updatePostingAccount(this.postingAccountFormData).pipe(map(response => {
      if (response) {
        this._messageService.clear();
        this._messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Posting account updated successfully', life: 3000 });
        this._postingAccountQuery.updatePostingAccount(response);
      }
    }, (error: any) => {
      this.postingAccountStateHistory.undo();
      this._messageService.clear();
      this._messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'An error occurred. Please try again later.',
        life: 3000
      });

    })).subscribe();
    this._postingAccountQuery.updatePostingAccount(this.postingAccountFormData);
    this.Close();
  }

  public submit(): void {
    if (!this.addPostingAccountForm.valid) {
      this.addPostingAccountForm.markAllAsTouched();
      this.focusOnInput('NameField');
      return;
    }
    if (this.config?.data) {
      this.updatePostingAccount();
    }
    else {
      this.addPostingAccount();
    }

  }

  public focusOnInput(id: string) {
    setTimeout(() => {
      document.getElementById(id)?.focus();
    }, 300);
  }

  private clearEntiriesForAddMultiRecord() {
    this.addPostingAccountForm.controls['Name'].reset();
    this.postingAccountFormData = new PostingAccountsResponse();
    this._dval.assignFormValuesToObject(this.addPostingAccountForm, this.postingAccountFormData);
  }
  public Close(): void {
    this.ref.close();
  }

  public initialDataServiceCalls(): void {

  }

  private buildForm(): void {
    this.addPostingAccountForm = this._formBuilder.group({
      PostingAccountsId: [0, []],
      OutletId: [this._authQuery.OutletId, [Validators.required, Validators.min(1)]],
      IsActive: [true, []],
      OpeningCredit: [0, []],
      OpeningDebit: [0, []],
      OpeningDate: [new Date(), [Validators.required]],
      SubCategoriesId: [0, [Validators.required, Validators.min(1)]],
      Name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      IsCredit: [false, []]
    });
  }

}
