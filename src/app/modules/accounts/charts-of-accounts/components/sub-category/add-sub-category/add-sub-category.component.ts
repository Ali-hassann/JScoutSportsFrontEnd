import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityStateHistoryPlugin } from '@datorama/akita';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map } from 'rxjs/operators';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { HeadCategorysResponse } from '../../../models/head-category.model';
import { SubCategoriesResponse } from '../../../models/sub-category.model';
import { SubCategoryService } from '../../../services/sub-category.service';
import { HeadCategoryQuery } from '../../../states/data-state/head-category.query';
import { SubCategoryQuery } from '../../../states/data-state/sub-category.query';
import { AddHeadCategoryComponent } from '../../head-category/add-head-category/add-head-category.component';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrls: ['./add-sub-category.component.scss']
})
export class AddSubCategoryComponent implements OnInit {

  public subCategoriesFormData: SubCategoriesResponse = new SubCategoriesResponse();
  public headCategoryDropDownList: HeadCategorysResponse[] = [];
  public addSubCategorytForm: FormGroup | any;

  public selectedCategory: SubCategoriesResponse = new SubCategoriesResponse();
  subCategoryStateHistory: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _dval: DomainValidatorsService,
    private _subCategoryService: SubCategoryService,
    public _config: DynamicDialogConfig,
    private _headCategoryQuery: HeadCategoryQuery,
    private _dialogService: DialogService,
    private _SubCategoryQuery: SubCategoryQuery,
    private _authQuery: AuthQuery,
    private ref: DynamicDialogRef,
    private _messageService: MessageService,
  ) {
    this.buildForm();
    this.subCategoryStateHistory = new EntityStateHistoryPlugin(this._SubCategoryQuery);
  }

  public ngOnInit(): void {
    this.assignValueToDropdownlist();
    this.assignParentFormData();
  }

  private assignParentFormData() {
    if (this._config.data) {
      this._dval.assignObjectValuesToForm(this.addSubCategorytForm, this._config.data);
      this.addSubCategorytForm.controls['Name'].setValue(this._config.data.SubCategoriesName);
    }
  }

  private assignValueToDropdownlist() {
    this._headCategoryQuery.headCategoryList$.subscribe(
      (x: any) => {
        this.headCategoryDropDownList = x
      }
    );
  }
  public onChangeCategory(event: any) {
    if (event) {
      this.addSubCategorytForm.controls['HeadCategoriesId'].setValue(event.value);
      this.focusOnInput('NameField');
    }
  }

  addHeadCategory() {
    let dialogRef = this._dialogService.open(AddHeadCategoryComponent, {
      header: 'Add Head Category',
      data: null,
      width: '35%'
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.assignValueToDropdownlist();
      }
    });
  }

  public addSubCategory(): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Subcategory is being added', sticky: true });

    this._dval.assignFormValuesToObject(this.addSubCategorytForm, this.subCategoriesFormData);
    this._SubCategoryQuery.addSubCategory(this.subCategoriesFormData);
    this._subCategoryService.addSubCategory(this.subCategoriesFormData).pipe(map(response => {
      if (response) {

        this._messageService.clear();
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Sub category added successfully', life: 3000 });

        this._SubCategoryQuery.removeSubCategory(0);
        this._SubCategoryQuery.addSubCategory(response);
      }
    }, (error: any) => {
      this.subCategoryStateHistory.undo();
      this._messageService.clear();
      this._messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'An error occurred. Please try again later.',
        life: 3000
      });
    })).subscribe();
    this._SubCategoryQuery.addSubCategory(this.subCategoriesFormData);
    this.clearEntiriesForAddMultiRecord();
    this.focusOnInput('NameField');
  }

  public updateSubCategory(): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Subcategory is being updated', sticky: true });
    this._dval.assignFormValuesToObject(this.addSubCategorytForm, this.subCategoriesFormData);
    
    this._SubCategoryQuery.updateSubCategory(this.subCategoriesFormData);
    this._subCategoryService.updateSubCategory(this.subCategoriesFormData).subscribe(data => {
      if (data && data.SubCategoriesId > 0) {
        this._messageService.clear();
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Subcategory updated successfully', life: 3000 });
        this._SubCategoryQuery.updateSubCategory(data);
        this.Close(true);
      }
    }, error => {
      this.subCategoryStateHistory.undo();
      this._messageService.clear();
      this._messageService.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'An error occurred. Please try again later.',
        life: 3000
      });
    });
    
    // this._SubCategoryQuery.updateSubCategory(this.subCategoriesFormData);
  }

  public submit(): void {
    if (!this.addSubCategorytForm.valid) {
      this.addSubCategorytForm.markAllAsTouched();
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Head category or name are empty or invalid', life: 3000 });
      this.focusOnInput('NameField');
      return;
    }
    if (this._config?.data) {
      this.updateSubCategory();
    }
    else {
      this.addSubCategory();
    }
  }

  public focusOnInput(id: string) {
    setTimeout(() => {
      document.getElementById(id)?.focus();
    }, 300);
  }

  private clearEntiriesForAddMultiRecord() {
    this.addSubCategorytForm.controls['Name'].reset();
    this.subCategoriesFormData = new SubCategoriesResponse();
    this._dval.assignFormValuesToObject(this.addSubCategorytForm, this.subCategoriesFormData);
  }

  public Close(isToRefresh: boolean = false): void {
    this.ref.close(isToRefresh);
  }

  private buildForm(): void {
    this.addSubCategorytForm = this._formBuilder.group({
      HeadCategoriesId: [0, [Validators.required, Validators.min(1)]],
      OutletId: [this._authQuery.OutletId, [Validators.required, Validators.min(1)]],
      SubCategoriesId: [0, []],
      Name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.maxLength(50)]],
    });
  }

}
