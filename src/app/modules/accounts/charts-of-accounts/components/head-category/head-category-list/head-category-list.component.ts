import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { COA } from 'src/app/shared/enums/rights.enum';
import { AccountHeadsFilterRequest } from '../../../models/charts-of-account.model';
import { HeadCategorysResponse } from '../../../models/head-category.model';
import { HeadCategoryService } from '../../../services/head-category.service';
import { HeadCategoryQuery } from '../../../states/data-state/head-category.query';
import { AddHeadCategoryComponent } from '../add-head-category/add-head-category.component';

@Component({
  selector: 'app-head-category-list',
  templateUrl: './head-category-list.component.html',
  styleUrls: ['./head-category-list.component.scss']
})
export class HeadCategoryListComponent implements OnInit {
  public headCategoryList: HeadCategorysResponse[] = [];

  public display: boolean = false;
  public isDataLoading: boolean = false;

  public selectedBranch: any = null;
  public clearHeadCategorySearch: string = "";

  cols: any[] = [
    { field: 'Name', header: 'Name' },
    { field: 'MainHeadsName', header: 'Main Head' },
  ];

  COA = COA;


  constructor(
    public _dialogService: DialogService,
    private _headCategoryService: HeadCategoryService,
    private _headCategoryQuery: HeadCategoryQuery,
    private _authQuery: AuthQuery,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService,
  ) {
    this._headCategoryQuery.selectLoading().subscribe(
      (x: any) => {
        this.isDataLoading = x;
      }
    );
    this._headCategoryQuery.headCategoryList$.subscribe(
      (x: any) => {
        this.headCategoryList = x;
      }
    );
  }

  public ngOnInit(): void {
    this.initialDataServiceCalls();
    //   this.setBreadCrumb();
  }

  public addHeadCategoryDialog(headCategory?: HeadCategorysResponse): void {
    let dialogRef = this._dialogService.open(AddHeadCategoryComponent, {
      header: 'Add Category',
      data: headCategory,
      width: '35%',
    });
  }

  deleteSelected(headCategory?: HeadCategorysResponse | any): void {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the selected head category?',
      accept: () => {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Category is being deleted' });
        if (this._headCategoryQuery.IsChildExist(headCategory.HeadCategoriesId)) {
          this._messageService.clear();
          this._messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Can not deleted because it has a child exist',
            life: 3000
          });
        }
        else {
          this._headCategoryQuery.removeHeadCategory(headCategory.HeadCategoriesId);
          this._headCategoryService.deleteHeadCategory(headCategory.HeadCategoriesId).subscribe(response => {
            this._messageService.clear();
            this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category deleted successfully', life: 3000 });
          });
        }
      }
    });
  }

  public initialDataServiceCalls(): void {
    if (!this._headCategoryQuery.hasEntity()) {
      let filterModal: AccountHeadsFilterRequest = new AccountHeadsFilterRequest();
      filterModal.OrganizationId = this._authQuery.OrganizationId;
      filterModal.OutletId = this._authQuery.OutletId;
      // this.isDataLoading$ = of(true);      
    }
  }
  public clear(table: Table): void {
    this.clearHeadCategorySearch = "";
    table.clear();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
