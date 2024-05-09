import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityStateHistoryPlugin, setLoading } from '@datorama/akita';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { tap } from 'rxjs/operators';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { HeadCategoriesRequest } from '../../../models/head-category.model';
import { MainHeadsResponse } from '../../../models/main-head.model';
import { HeadCategoryService } from '../../../services/head-category.service';
import { HeadCategoryQuery } from '../../../states/data-state/head-category.query';
import { MeanHeadQuery } from '../../../states/data-state/main-head.query';

@Component({
  selector: 'app-add-head-category',
  templateUrl: './add-head-category.component.html',
  styleUrls: ['./add-head-category.component.scss']
})
export class AddHeadCategoryComponent implements OnInit {

  public parentFormData: HeadCategoriesRequest = new HeadCategoriesRequest();
  public mainHeadList: MainHeadsResponse[] = [];
  public headCategoryRequest: HeadCategoriesRequest = new HeadCategoriesRequest();
  public addHeadCategoryForm: FormGroup | any;
  public headCategoryStateHistory: EntityStateHistoryPlugin;

  constructor(
    private _formBuilder: FormBuilder,
    private _dval: DomainValidatorsService,
    private _mainHeadQuery: MeanHeadQuery,
    private _headCategoryQuery: HeadCategoryQuery,
    private _authQuery: AuthQuery,
    private _headCategoryService: HeadCategoryService,
    private messageService: MessageService,
    public _configDialog: DynamicDialogConfig,
    public _configDialogRef: DynamicDialogRef,
    private _messageService: MessageService,
  ) {
    this._mainHeadQuery.mainHeadList$.subscribe(
      (x: any) => {
        this.mainHeadList = x
      }
    );
    this.parentFormData = _configDialog?.data ?? new HeadCategoriesRequest();
    this.headCategoryStateHistory = new EntityStateHistoryPlugin(this._headCategoryQuery);
  }

  public ngOnInit(): void {
    this.buildForm();
    this.assignParentFormData();
    this.onMainHeadChange();
  }

  private assignParentFormData() {
    if (this._configDialog.data) {
      this._dval.assignObjectValuesToForm(this.addHeadCategoryForm, this._configDialog.data);
    }
  }

  private onMainHeadChange() {
    this.addHeadCategoryForm.controls['MainHeadsId'].valueChanges.subscribe((x: any) => {

      if (x) {
        this.focusOnInput('NameField')
      }
    })
  }

  public submit(): void {
    debugger;
    if (!this.addHeadCategoryForm.valid) {
      this.addHeadCategoryForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Main head or name are empty or invalid', life: 3000 });
      this.focusOnInput('NameField');
      return;
    }
    if (this._configDialog.data) {
      this.updateHeadCategory();
    }
    else {
      this.addHeadCategory();
    }

  }

  public addHeadCategory(): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Head category is being added' });
    this._dval.assignFormValuesToObject(this.addHeadCategoryForm, this.headCategoryRequest);
    this._headCategoryQuery.addHeadCategory(this.headCategoryRequest);
    this._headCategoryService
      .addHeadCategory(this.headCategoryRequest)
      .pipe
      (
        tap(data => {
          if (data && data.HeadCategoriesId > 0) {
            this._messageService.clear();
            this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Head category added successfully', life: 3000 });
            this._headCategoryQuery.removeHeadCategory(0);
            this._headCategoryQuery.addHeadCategory(data);
          }
        }, error => {
          this.headCategoryStateHistory.undo();
          this._messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred. Please try again later.',
            life: 3000
          });
        })
      )
      .subscribe();

    this.clearEntiriesForAddMultiRecord();
    this.focusOnInput('NameField');
  }

  public updateHeadCategory(): void {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Head category is being updated' });
    this._dval.assignFormValuesToObject(this.addHeadCategoryForm, this.headCategoryRequest);
    this._headCategoryQuery.updateHeadCategory(this.headCategoryRequest);
    this._headCategoryService
      .updateHeadCategory(this.headCategoryRequest)
      .subscribe(data => {
        if (data && data.HeadCategoriesId > 0) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Head category updated successfully', life: 3000 });
          this._headCategoryQuery.updateHeadCategory(data);
        }
      }, error => {
        this.headCategoryStateHistory.undo();
        this._messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred. Please try again later.',
          life: 3000
        });
      })
    this.Close();
  }

  public focusOnInput(id: string) {
    setTimeout(() => {
      document.getElementById(id)?.focus();
    }, 300);
  }

  private clearEntiriesForAddMultiRecord() {
    this.addHeadCategoryForm.controls['Name'].reset();
    this.headCategoryRequest = new HeadCategoriesRequest();
    this._dval.assignFormValuesToObject(this.addHeadCategoryForm, this.headCategoryRequest);

  }

  public Close(): void {
    this._configDialogRef.close();
  }
  private buildForm(): void {
    this.addHeadCategoryForm = this._formBuilder.group({
      HeadCategoriesId: [0, []],
      OutletId: [this._authQuery.OutletId, [Validators.required, Validators.min(1)]],
      Name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      MainHeadsId: [0, [Validators.required, Validators.min(1)]]
    });
  }


}
